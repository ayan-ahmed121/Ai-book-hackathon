# Tasks: Textbook Content Generation

**Input**: Design documents from `/specs/001-textbook-generation/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.yaml, research.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Backend API in `backend/`
- Frontend Docusaurus in `frontend/`
- Content files in `content/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create monorepo project structure with backend/ and frontend/ directories
- [x] T002 Initialize backend Node.js project with TypeScript in backend/package.json
- [x] T003 [P] Initialize Docusaurus 3.9 project with React 19 in frontend/
- [x] T004 [P] Configure ESLint and Prettier for both backend and frontend
- [x] T005 [P] Create shared .env.example files for backend/.env.example and frontend/.env.example
- [x] T006 Create root package.json with workspace scripts for monorepo management

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Configure Neon PostgreSQL connection in backend/src/db/client.ts
- [x] T008 [P] Create Drizzle ORM schema with all entities in backend/src/db/schema.ts
- [x] T009 [P] Setup Qdrant client connection in backend/src/services/qdrant.ts
- [x] T010 Configure Better-Auth with email/password in backend/src/auth.ts
- [x] T011 [P] Setup Resend email service in backend/src/services/email.ts
- [x] T012 [P] Create health check endpoint in backend/src/api/health.ts
- [x] T013 Setup API router with CORS and middleware in backend/src/index.ts
- [x] T014 Run Drizzle migrations to create database tables
- [x] T015 [P] Configure Docusaurus i18n for English and Urdu (RTL) in frontend/docusaurus.config.ts
- [x] T016 Swizzle Docusaurus Root component for auth provider in frontend/src/theme/Root.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and Read Chapters (Priority: P1) MVP

**Goal**: Learners can browse and read 6-8 well-structured chapters on Physical AI and Humanoid Robotics

**Independent Test**: Navigate to homepage, see chapter list, click chapter, read content on mobile viewport (375px)

### Implementation for User Story 1

- [x] T017 [P] [US1] Create chapter 1 MDX content (Introduction to Physical AI) in frontend/docs/chapters/ch1-introduction.mdx
- [x] T018 [P] [US1] Create chapter 2 MDX content (Humanoid Robotics Fundamentals) in frontend/docs/chapters/ch2-humanoid-fundamentals.mdx
- [x] T019 [P] [US1] Create chapter 3 MDX content (Sensors and Perception) in frontend/docs/chapters/ch3-sensors-perception.mdx
- [x] T020 [P] [US1] Create chapter 4 MDX content (Motion Planning and Control) in frontend/docs/chapters/ch4-motion-planning.mdx
- [x] T021 [P] [US1] Create chapter 5 MDX content (AI Integration in Robotics) in frontend/docs/chapters/ch5-ai-integration.mdx
- [x] T022 [P] [US1] Create chapter 6 MDX content (Real-World Applications) in frontend/docs/chapters/ch6-applications.mdx
- [x] T023 [US1] Configure Docusaurus sidebar for chapter navigation in frontend/sidebars.ts
- [x] T024 [US1] Add chapter illustrations and diagrams to frontend/static/img/chapters/
- [x] T025 [US1] Style chapter pages for mobile-first responsive design in frontend/src/css/custom.css
- [x] T026 [US1] Add previous/next navigation component at chapter end in frontend/src/components/ChapterNavigation/index.tsx

**Checkpoint**: User Story 1 complete - chapters readable, mobile responsive, navigation working

---

## Phase 4: User Story 2 - RAG Chatbot Q&A (Priority: P2)

**Goal**: Learners can ask questions and receive grounded answers from textbook content with source citations

**Independent Test**: Open chatbot, ask question about chapter content, receive answer with source reference

### Implementation for User Story 2

- [ ] T027 [P] [US2] Create MiniLM embedding service in backend/src/services/embeddings.ts
- [ ] T028 [P] [US2] Create content chunking utility (400-512 tokens, 50 overlap) in backend/src/services/chunker.ts
- [ ] T029 [US2] Create script to chunk chapters and upload to Qdrant in backend/src/scripts/seed-embeddings.ts
- [ ] T030 [US2] Run embedding seed script to populate Qdrant vector collection
- [ ] T031 [US2] Implement RAG search service with grounding prompts in backend/src/services/rag.ts
- [ ] T032 [US2] Create chat API endpoint (POST /api/chat) in backend/src/api/chat.ts
- [ ] T033 [US2] Create ChatMessage model operations in backend/src/db/chat-messages.ts
- [ ] T034 [P] [US2] Create ChatBot React component UI in frontend/src/components/ChatBot/index.tsx
- [ ] T035 [P] [US2] Create ChatBot styles (mobile-friendly) in frontend/src/components/ChatBot/styles.css
- [ ] T036 [US2] Add ChatBot to MDX global components in frontend/src/theme/MDXComponents.tsx
- [ ] T037 [US2] Embed ChatBot component in chapter layout for all pages
- [ ] T038 [US2] Implement source citation display in chatbot responses

**Checkpoint**: User Story 2 complete - chatbot answers questions with grounded responses and citations

---

## Phase 5: User Story 3 - Personalized Content (Priority: P3)

**Goal**: Content adapts based on learner's background level (beginner/intermediate/expert)

**Independent Test**: Register, select background level, view chapter, see adapted content complexity

### Implementation for User Story 3

- [ ] T039 [US3] Create personalization service with AI content adaptation in backend/src/services/personalization.ts
- [ ] T040 [US3] Create personalized content endpoint (GET /api/content/:chapterId/personalized) in backend/src/api/user.ts
- [ ] T041 [US3] Create useUserPrefs hook for preference management in frontend/src/hooks/useUserPrefs.ts
- [ ] T042 [US3] Create BackgroundLevelSelector component in frontend/src/components/BackgroundLevelSelector/index.tsx
- [ ] T043 [US3] Add background level prompt to registration flow in frontend/src/pages/register.tsx
- [ ] T044 [US3] Create PersonalizedChapter wrapper component in frontend/src/components/PersonalizedChapter/index.tsx
- [ ] T045 [US3] Integrate personalized content rendering in chapter pages using BrowserOnly

**Checkpoint**: User Story 3 complete - content adapts to user's selected background level

---

## Phase 6: User Story 4 - Urdu Translation (Priority: P4)

**Goal**: Learners can toggle between English and Urdu chapter content

**Independent Test**: Toggle language to Urdu, see chapter content in Urdu with RTL layout

### Implementation for User Story 4

- [ ] T046 [P] [US4] Create Urdu translation for chapter 1 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch1-introduction.mdx
- [ ] T047 [P] [US4] Create Urdu translation for chapter 2 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch2-humanoid-fundamentals.mdx
- [ ] T048 [P] [US4] Create Urdu translation for chapter 3 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch3-sensors-perception.mdx
- [ ] T049 [P] [US4] Create Urdu translation for chapter 4 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch4-motion-planning.mdx
- [ ] T050 [P] [US4] Create Urdu translation for chapter 5 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch5-ai-integration.mdx
- [ ] T051 [P] [US4] Create Urdu translation for chapter 6 in frontend/i18n/ur/docusaurus-plugin-content-docs/current/chapters/ch6-applications.mdx
- [ ] T052 [US4] Create Urdu UI translations in frontend/i18n/ur/code.json
- [ ] T053 [US4] Create LanguageToggle component in frontend/src/components/LanguageToggle/index.tsx
- [ ] T054 [US4] Add RTL-specific styles for Urdu layout in frontend/src/css/rtl.css
- [ ] T055 [US4] Persist language preference in user settings via API

**Checkpoint**: User Story 4 complete - Urdu translation available with RTL support

---

## Phase 7: User Story 5 - Summaries and Quizzes (Priority: P5)

**Goal**: Each chapter has a summary and interactive quiz for self-assessment

**Independent Test**: Finish chapter, view summary, take quiz, see score and correct answers

### Implementation for User Story 5

- [ ] T056 [P] [US5] Add summary section to chapter 1 MDX in frontend/docs/chapters/ch1-introduction.mdx
- [ ] T057 [P] [US5] Add summary section to chapters 2-6 MDX files
- [ ] T058 [P] [US5] Create quiz JSON for chapter 1 (5-10 MCQ) in content/quizzes/ch1-introduction.json
- [ ] T059 [P] [US5] Create quiz JSON for chapters 2-6 in content/quizzes/
- [ ] T060 [US5] Create quiz API endpoint (GET /api/quiz/:chapterId) in backend/src/api/quiz.ts
- [ ] T061 [US5] Create quiz submission endpoint (POST /api/quiz/:chapterId/submit) in backend/src/api/quiz.ts
- [ ] T062 [US5] Create QuizAttempt database operations in backend/src/db/quiz-attempts.ts
- [ ] T063 [P] [US5] Create Quiz React component with MCQ UI in frontend/src/components/Quiz/index.tsx
- [ ] T064 [P] [US5] Create Quiz styles in frontend/src/components/Quiz/styles.css
- [ ] T065 [US5] Create QuizResults component showing score and explanations in frontend/src/components/Quiz/QuizResults.tsx
- [ ] T066 [US5] Add Quiz component to chapter MDX global components
- [ ] T067 [US5] Create quiz history endpoint (GET /api/quiz/history) in backend/src/api/quiz.ts

**Checkpoint**: User Story 5 complete - summaries visible, quizzes functional with scoring

---

## Phase 8: User Story 6 - User Authentication (Priority: P6)

**Goal**: Users can sign up, log in, and have their preferences/progress persisted

**Independent Test**: Sign up, log out, log in, verify preferences and quiz history persist

### Implementation for User Story 6

- [ ] T068 [P] [US6] Create useAuth hook with Better-Auth client in frontend/src/hooks/useAuth.ts
- [ ] T069 [P] [US6] Create LoginForm component in frontend/src/components/LoginForm/index.tsx
- [ ] T070 [P] [US6] Create RegisterForm component in frontend/src/components/RegisterForm/index.tsx
- [ ] T071 [US6] Create login page in frontend/src/pages/login.tsx
- [ ] T072 [US6] Create register page in frontend/src/pages/register.tsx
- [ ] T073 [US6] Create password reset page in frontend/src/pages/reset-password.tsx
- [ ] T074 [US6] Create forgot password page in frontend/src/pages/forgot-password.tsx
- [ ] T075 [US6] Create user preferences API endpoints (GET/PUT /api/user/preferences) in backend/src/api/user.ts
- [ ] T076 [US6] Create user profile API endpoint (GET /api/user/profile) in backend/src/api/user.ts
- [ ] T077 [US6] Add auth navigation (Login/Logout button) to Docusaurus navbar in frontend/src/theme/Navbar/
- [ ] T078 [US6] Implement session persistence and auto-refresh in auth hook

**Checkpoint**: User Story 6 complete - full auth flow working with preference persistence

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T079 [P] Add loading states and skeletons to all async components
- [ ] T080 [P] Add error boundaries and user-friendly error messages
- [ ] T081 Optimize Lighthouse mobile score (target > 70) in frontend build
- [ ] T082 [P] Add structured logging to all API endpoints in backend
- [ ] T083 Configure production build and deployment to Vercel
- [ ] T084 Create 90-second demo script covering all user stories
- [ ] T085 Run quickstart.md validation to ensure setup instructions work
- [ ] T086 Final mobile responsiveness testing on 375px viewport

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Chapters): No dependencies on other stories
  - US2 (Chatbot): Requires US1 content for embeddings
  - US3 (Personalization): Requires US6 auth for preferences
  - US4 (Translation): Requires US1 content to translate
  - US5 (Quizzes): Requires US1 content, US6 auth for score persistence
  - US6 (Auth): No dependencies on other stories
- **Polish (Phase 9)**: Depends on all user stories being complete

### Recommended Implementation Order

```
Phase 1 (Setup) → Phase 2 (Foundation)
                        ↓
            ┌───────────┼───────────┐
            ↓           ↓           ↓
         US1 (P1)    US6 (P6)    (wait)
         Chapters    Auth
            ↓           ↓
         US2 (P2)    US3 (P3)
         Chatbot     Personal.
            ↓           ↓
         US4 (P4)    US5 (P5)
         Urdu        Quizzes
            ↓           ↓
            └─────┬─────┘
                  ↓
            Phase 9 (Polish)
```

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005 can run in parallel
```

**Phase 2 (Foundation)**:
```
T008, T009, T011, T012, T015 can run in parallel
```

**Phase 3 (US1 - Chapters)**:
```
T017, T018, T019, T020, T021, T022 can run in parallel (all chapter creation)
```

**Phase 4 (US2 - Chatbot)**:
```
T027, T028 can run in parallel (embedding + chunking services)
T034, T035 can run in parallel (React component + styles)
```

**Phase 6 (US4 - Urdu)**:
```
T046, T047, T048, T049, T050, T051 can run in parallel (all translations)
```

**Phase 7 (US5 - Quizzes)**:
```
T056, T057 can run in parallel (summaries)
T058, T059 can run in parallel (quiz JSON)
T063, T064 can run in parallel (React component + styles)
```

**Phase 8 (US6 - Auth)**:
```
T068, T069, T070 can run in parallel (hooks + form components)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Browse Chapters)
4. **STOP and VALIDATE**: 6-8 chapters readable on mobile
5. Deploy/demo if ready

**MVP Task Count**: 26 tasks (T001-T026)

### Demo-Ready Build (US1 + US2 + US5 + US6)

For 90-second demo covering core features:

1. Setup + Foundation (T001-T016)
2. US1: Chapters (T017-T026)
3. US2: Chatbot (T027-T038)
4. US6: Auth (T068-T078)
5. US5: Quizzes (T056-T067)

**Demo Task Count**: 62 tasks

### Full Feature Set

All 86 tasks for complete feature set including personalization and Urdu translation.

---

## Task Summary

| Phase | Story | Tasks | Parallel |
|-------|-------|-------|----------|
| 1 - Setup | - | 6 | 3 |
| 2 - Foundation | - | 10 | 5 |
| 3 - Chapters | US1 | 10 | 6 |
| 4 - Chatbot | US2 | 12 | 4 |
| 5 - Personalization | US3 | 7 | 0 |
| 6 - Urdu | US4 | 10 | 6 |
| 7 - Quizzes | US5 | 12 | 6 |
| 8 - Auth | US6 | 11 | 3 |
| 9 - Polish | - | 8 | 4 |
| **Total** | | **86** | **37** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- File paths are relative to repository root
