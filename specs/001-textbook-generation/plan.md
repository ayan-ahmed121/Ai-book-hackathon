# Implementation Plan: Textbook Content Generation

**Branch**: `001-textbook-generation` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-textbook-generation/spec.md`

## Summary

Build an AI-native interactive textbook platform for Physical AI & Humanoid Robotics using Docusaurus for static content generation, a RAG chatbot with Qdrant + MiniLM for grounded Q&A, Better-Auth + Neon for user authentication and personalization, and AI-powered translation/quiz generation.

## Technical Context

**Language/Version**: TypeScript 5.3+ / Node.js 20 LTS
**Primary Dependencies**: Docusaurus 3.9, React 19, Better-Auth, Qdrant Client, sentence-transformers
**Storage**: Neon PostgreSQL (free tier: 0.5GB), Qdrant Cloud (free tier: 1GB)
**Testing**: Vitest (unit), Playwright (e2e)
**Target Platform**: Web (mobile-first, 375px minimum viewport)
**Project Type**: Web application (frontend + backend API)
**Performance Goals**: <3s initial load on mobile, <2s chatbot response
**Constraints**: Free-tier only ($0 infrastructure), 90-second demo, Lighthouse mobile >70
**Scale/Scope**: ~100 concurrent users, 6-8 chapters, single textbook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Simplicity First | Avoid heavy deps, support low-end devices | PASS | Docusaurus SSG, minimal JS, MiniLM (22.7M params) |
| II. Free-Tier Infrastructure | Qdrant free (1GB), Neon free (0.5GB) | PASS | Validated limits support ~100 users |
| III. RAG Accuracy | Grounded responses, MiniLM embeddings | PASS | Refusal prompts + source citations |
| IV. Learner Personalization | Background levels, Urdu translation | PASS | AI-generated content adaptation |
| V. Authentication Simplicity | Better-Auth email/password | PASS | No OAuth complexity |
| VI. Observable & Debuggable | Health checks, structured logging | PASS | API health endpoints planned |

**Gate Result**: ALL PASS - Proceed to implementation

## Project Structure

### Documentation (this feature)

```text
specs/001-textbook-generation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth.ts              # Better-Auth configuration
│   ├── db/
│   │   ├── schema.ts        # Drizzle ORM schema
│   │   └── client.ts        # Neon connection
│   ├── api/
│   │   ├── chat.ts          # RAG chatbot endpoint
│   │   ├── user.ts          # User preferences endpoints
│   │   ├── quiz.ts          # Quiz submission endpoints
│   │   └── health.ts        # Health check endpoint
│   └── services/
│       ├── qdrant.ts        # Vector search service
│       ├── embeddings.ts    # MiniLM embedding service
│       ├── personalization.ts # Content adaptation service
│       └── email.ts         # Resend email service
└── tests/
    ├── unit/
    └── integration/

frontend/
├── docusaurus.config.ts     # Docusaurus + i18n config
├── src/
│   ├── theme/
│   │   └── Root.tsx         # Auth provider (swizzled)
│   ├── components/
│   │   ├── ChatBot/         # RAG chatbot UI
│   │   ├── Quiz/            # Quiz component
│   │   ├── LoginForm/       # Auth forms
│   │   └── LanguageToggle/  # EN/UR toggle
│   ├── hooks/
│   │   ├── useAuth.ts       # Better-Auth client hooks
│   │   └── useUserPrefs.ts  # User preferences hook
│   └── pages/
│       ├── login.tsx
│       ├── register.tsx
│       └── reset-password.tsx
├── docs/
│   └── chapters/            # 6-8 chapter MDX files
├── i18n/
│   └── ur/                  # Urdu translations
│       └── docusaurus-plugin-content-docs/
└── static/
    └── img/                 # Chapter illustrations

content/
├── chapters/                # Source chapter content (Markdown)
├── embeddings/              # Pre-computed chunk embeddings
└── quizzes/                 # Generated quiz JSON
```

**Structure Decision**: Web application with separate frontend (Docusaurus static site) and backend (API for auth, RAG, quizzes). Content stored as MDX in frontend, embeddings in Qdrant, user data in Neon.

## Complexity Tracking

> No violations - all choices comply with Constitution principles.

| Decision | Justification | Alternative Rejected |
|----------|---------------|---------------------|
| Separate backend API | RAG + Auth require server-side logic | Pure static (no personalization) |
| Drizzle ORM | Lightweight, TypeScript-native | Prisma (heavier, more deps) |
| MiniLM-L6-v2 | 22.7M params, runs on CPU | MPNet (110M params, slower) |
| Resend for email | 3000/month free, simple API | SendGrid (trial only), AWS SES (complex) |

## Key Technical Decisions

### 1. RAG Architecture

- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (384-dim, 22.7M params)
- **Vector DB**: Qdrant Cloud free tier (1GB, ~1M vectors)
- **Chunking**: Recursive character splitting, 400-512 tokens, 50-100 token overlap
- **Grounding**: Refusal prompts + mandatory source citations

### 2. Authentication Flow

- **Provider**: Better-Auth with email/password
- **Session**: 7-day expiry, cookie caching (5 min), daily refresh
- **Password Reset**: Token-based with Resend email (3000/month free)

### 3. Personalization Strategy

- **Background Levels**: Beginner/Intermediate/Expert stored in user preferences
- **Content Adaptation**: AI prompt modifies chapter rendering based on level
- **Language**: Docusaurus i18n with RTL support for Urdu

### 4. Quiz Generation

- **Source**: AI-generated from chapter content
- **Format**: 5-10 MCQ per chapter, stored as JSON
- **Scoring**: Client-side validation, results persisted for authenticated users

## Phase Dependencies

```
Phase 0 (Research) → Phase 1 (Design) → /sp.tasks (Phase 2)
         ↓                    ↓
    research.md         data-model.md
                        contracts/
                        quickstart.md
```

## Risk Mitigation

| Risk | Mitigation | Fallback |
|------|------------|----------|
| RAG accuracy <90% | Semantic chunking, refusal prompts | Manual chunk curation |
| Free-tier exceeded | Usage monitoring, caching | Defer features to Phase 2 |
| Mobile performance | SSG, lazy loading, minimal JS | Reduce animations, images |
| Demo overrun | Script demo, pre-load data | Record multiple takes |
