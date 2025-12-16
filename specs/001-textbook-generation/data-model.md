# Data Model: Textbook Content Generation

**Date**: 2025-12-15
**Branch**: `001-textbook-generation`

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    User     │───────│ UserPreferences  │       │     Chapter     │
└─────────────┘       └──────────────────┘       └─────────────────┘
       │                                                  │
       │                                                  │
       ▼                                                  ▼
┌─────────────┐                                   ┌─────────────────┐
│ QuizAttempt │───────────────────────────────────│      Quiz       │
└─────────────┘                                   └─────────────────┘
       │
       ▼
┌─────────────────┐
│  ChatMessage    │
└─────────────────┘
```

## Entities

### User (PostgreSQL - Neon)

Represents a learner with authentication credentials.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-gen | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| emailVerified | BOOLEAN | DEFAULT false | Email verification status |
| name | VARCHAR(100) | NOT NULL | Display name |
| passwordHash | VARCHAR(255) | NOT NULL | Scrypt-hashed password |
| createdAt | TIMESTAMP | DEFAULT now() | Account creation time |
| updatedAt | TIMESTAMP | ON UPDATE | Last modification time |

**Indexes**: `email` (unique), `createdAt`

### UserPreferences (PostgreSQL - Neon)

Stores user personalization settings.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-gen | Unique identifier |
| userId | UUID | FK → User.id, UNIQUE | Owner reference |
| backgroundLevel | ENUM | NOT NULL | 'beginner' \| 'intermediate' \| 'expert' |
| language | ENUM | DEFAULT 'en' | 'en' \| 'ur' |
| theme | ENUM | DEFAULT 'light' | 'light' \| 'dark' |
| createdAt | TIMESTAMP | DEFAULT now() | Creation time |
| updatedAt | TIMESTAMP | ON UPDATE | Last update time |

**Indexes**: `userId` (unique)

### Session (PostgreSQL - Neon)

Better-Auth managed session table.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Session identifier |
| userId | UUID | FK → User.id | User reference |
| token | VARCHAR(255) | UNIQUE | Session token |
| expiresAt | TIMESTAMP | NOT NULL | Expiration time |
| createdAt | TIMESTAMP | DEFAULT now() | Creation time |
| ipAddress | VARCHAR(45) | NULL | Client IP |
| userAgent | TEXT | NULL | Browser user agent |

### Chapter (Static JSON/MDX - Git)

Represents textbook chapter content. Stored as MDX files, not in database.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Chapter slug (e.g., "ch1-introduction") |
| title | string | Chapter title |
| order | number | Display order (1-8) |
| content | MDX | Chapter body content |
| summary | string[] | 3-5 bullet point summary |
| estimatedReadTime | number | Minutes to read |

**Storage**: `frontend/docs/chapters/{id}.mdx`

### Quiz (Static JSON - Git)

Represents quiz questions for a chapter.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Quiz identifier (e.g., "quiz-ch1") |
| chapterId | string | Associated chapter ID |
| questions | Question[] | Array of quiz questions |
| passingScore | number | Minimum % to pass (default: 70) |

**Question Schema**:
```typescript
{
  id: string;           // "q1", "q2", etc.
  text: string;         // Question text
  options: string[];    // 4 answer options
  correctIndex: number; // Index of correct answer (0-3)
  explanation: string;  // Why the answer is correct
}
```

**Storage**: `content/quizzes/{chapterId}.json`

### QuizAttempt (PostgreSQL - Neon)

Records user quiz submissions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-gen | Unique identifier |
| userId | UUID | FK → User.id | User who took quiz |
| quizId | VARCHAR(50) | NOT NULL | Quiz identifier |
| score | INTEGER | NOT NULL | Percentage score (0-100) |
| answers | JSONB | NOT NULL | User's answer selections |
| passed | BOOLEAN | NOT NULL | Met passing threshold |
| completedAt | TIMESTAMP | DEFAULT now() | Submission time |

**Indexes**: `userId`, `quizId`, `(userId, quizId)` composite

### ChatMessage (PostgreSQL - Neon)

Records chatbot interactions for analytics.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-gen | Unique identifier |
| userId | UUID | FK → User.id, NULL | User (NULL if anonymous) |
| sessionId | VARCHAR(100) | NOT NULL | Chat session identifier |
| question | TEXT | NOT NULL | User's question |
| answer | TEXT | NOT NULL | Chatbot's response |
| sources | JSONB | NOT NULL | Source citations array |
| relevanceScore | FLOAT | NULL | RAG relevance metric |
| createdAt | TIMESTAMP | DEFAULT now() | Message time |

**Indexes**: `userId`, `sessionId`, `createdAt`

### ChunkEmbedding (Qdrant - Vector DB)

Stores chapter content chunks for RAG retrieval.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Chunk identifier |
| vector | float[384] | MiniLM embedding |
| payload.text | string | Chunk text content |
| payload.chapterId | string | Source chapter |
| payload.sectionTitle | string | Section heading |
| payload.chunkIndex | number | Position in chapter |

**Collection**: `textbook_chunks`
**Distance**: Cosine similarity

## Validation Rules

### User
- Email must be valid format
- Password minimum 8 characters, maximum 128
- Name required, 1-100 characters

### UserPreferences
- backgroundLevel must be one of: beginner, intermediate, expert
- language must be one of: en, ur

### QuizAttempt
- score between 0-100
- answers must match quiz question count

### ChatMessage
- question max 1000 characters (truncate longer)
- sources must be valid JSON array

## State Transitions

### User Registration Flow
```
[Anonymous] → signUp() → [Registered, emailVerified=false]
           → verifyEmail() → [Registered, emailVerified=true]
```

### Quiz Attempt Flow
```
[No Attempt] → startQuiz() → [In Progress]
            → submitQuiz() → [Completed, score calculated]
```

### Background Level Flow
```
[Not Set] → selectLevel() → [Beginner|Intermediate|Expert]
         → changeLevel() → [Updated Level]
```

## Drizzle ORM Schema

```typescript
// backend/src/db/schema.ts
import { pgTable, uuid, varchar, boolean, timestamp,
         pgEnum, jsonb, integer, real, text } from 'drizzle-orm/pg-core';

export const backgroundLevelEnum = pgEnum('background_level',
  ['beginner', 'intermediate', 'expert']);

export const languageEnum = pgEnum('language', ['en', 'ur']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  name: varchar('name', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique(),
  backgroundLevel: backgroundLevelEnum('background_level').notNull(),
  language: languageEnum('language').default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  quizId: varchar('quiz_id', { length: 50 }).notNull(),
  score: integer('score').notNull(),
  answers: jsonb('answers').notNull(),
  passed: boolean('passed').notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sources: jsonb('sources').notNull(),
  relevanceScore: real('relevance_score'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Storage Estimates

| Entity | Rows (MVP) | Avg Size | Total |
|--------|------------|----------|-------|
| Users | 100 | 500 bytes | 50 KB |
| UserPreferences | 100 | 200 bytes | 20 KB |
| Sessions | 200 | 300 bytes | 60 KB |
| QuizAttempts | 500 | 500 bytes | 250 KB |
| ChatMessages | 2000 | 2 KB | 4 MB |
| **Total PostgreSQL** | | | **~5 MB** |

| Entity | Items | Avg Size | Total |
|--------|-------|----------|-------|
| ChunkEmbeddings | 1000 | 1.5 KB | 1.5 MB |
| **Total Qdrant** | | | **~2 MB** |

**Conclusion**: Well within free tier limits (Neon: 500 MB, Qdrant: 1 GB)
