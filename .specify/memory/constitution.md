<!--
Sync Impact Report
==================
- Version change: N/A → 1.0.0 (Initial ratification)
- Added sections:
  - Core Principles (6 principles)
  - Technical Constraints section
  - Development Workflow section
  - Governance section
- Modified principles: N/A (initial version)
- Removed sections: N/A (initial version)
- Templates validated:
  - .specify/templates/plan-template.md ✅ (compatible with constitution gates)
  - .specify/templates/spec-template.md ✅ (compatible with user stories approach)
  - .specify/templates/tasks-template.md ✅ (compatible with phased approach)
- Follow-up TODOs: None
-->

# AI-Native Textbook for Physical AI & Humanoid Robotics Constitution

## Core Principles

### I. Simplicity First

Every feature MUST prioritize simplicity over complexity. The textbook platform MUST:
- Avoid heavy dependencies and complex abstractions
- Support low-end devices (mobile phones with limited resources)
- Minimize JavaScript bundle size and render-blocking resources
- Use progressive enhancement over feature-rich defaults

**Rationale**: Target users include learners on mobile devices with limited bandwidth. Complexity increases load times, maintenance burden, and failure points. YAGNI (You Aren't Gonna Need It) governs all feature decisions.

### II. Free-Tier Infrastructure

All infrastructure MUST operate within free-tier limits. The system MUST:
- Use Qdrant Cloud free tier for vector storage (RAG chatbot)
- Use Neon PostgreSQL free tier for user data and authentication
- Minimize token usage through chunking and efficient prompts
- Implement caching strategies to reduce external API calls

**Rationale**: Project constraint mandates zero infrastructure cost. Exceeding free tiers blocks deployment. All architectural decisions MUST verify free-tier compatibility before implementation.

### III. RAG Accuracy Over Features

The RAG chatbot MUST provide grounded, accurate answers from book content only. The system MUST:
- Use proper chunking strategies (semantic chunking preferred)
- Implement MiniLM embeddings for cost-effective vector search
- Return "I don't know" for questions outside book scope
- Never hallucinate or invent content not in the source material

**Rationale**: Educational content accuracy is non-negotiable. A chatbot that provides wrong answers damages learner trust and educational outcomes. Grounded answers from verified content MUST take precedence over response coverage.

### IV. Learner-Centric Personalization

Personalization features MUST enhance learning outcomes. The system MUST:
- Adapt chapter content based on learner background (beginner/intermediate/expert)
- Provide Urdu translation capability for accessibility
- Generate summaries and quizzes per chapter
- Keep UI minimal and clean to avoid confusion

**Rationale**: Different learners have different backgrounds and language preferences. Personalization increases engagement and comprehension. However, personalization MUST NOT add complexity that violates Principle I.

### V. Authentication Simplicity

User authentication MUST use Better-Auth with minimal configuration. The system MUST:
- Implement signup/login flows with email/password
- Store user preferences and learning progress
- Protect user data appropriately
- Avoid complex OAuth flows unless explicitly required

**Rationale**: Authentication is a means to personalization, not a feature itself. Over-engineering auth adds attack surface and maintenance burden. Simple, secure defaults satisfy requirements.

### VI. Observable and Debuggable

All backend services MUST be observable and debuggable. The system MUST:
- Add health check endpoints for all services
- Implement structured logging for error tracking
- Provide clear error messages to users
- Support 90-second demo recording requirement

**Rationale**: Backend errors block user experience and demo success. Observable systems enable rapid debugging. Health checks ensure deployment stability.

## Technical Constraints

The following constraints are NON-NEGOTIABLE for this project:

| Constraint | Requirement | Validation |
|------------|-------------|------------|
| Infrastructure Cost | $0 (free tiers only) | Qdrant Cloud free, Neon free |
| Demo Duration | 90 seconds maximum | Recording must fit time limit |
| Device Support | Low-end mobile phones | Lighthouse mobile score > 70 |
| Chapter Count | 6-8 chapters | Short, clean, modern content |
| Framework | Docusaurus | Static site generation |
| Auth Provider | Better-Auth | Signup/login functionality |
| Vector DB | Qdrant | RAG chatbot embeddings |
| Relational DB | Neon PostgreSQL | User data, preferences |
| Embeddings | MiniLM | Cost-effective, accurate |

## Development Workflow

### Definition of Done

A feature is complete when ALL of the following are satisfied:

- [ ] All chapters visible and readable in Docusaurus
- [ ] Chatbot fully functional with grounded answers (no hallucination)
- [ ] Authentication and personalization working
- [ ] Urdu translation capability functional
- [ ] Quizzes and summaries generated per chapter
- [ ] Fully deployed with stable URIs
- [ ] 90-second demo recorded successfully

### Risk Mitigation Strategy

| Risk | Mitigation |
|------|------------|
| RAG low accuracy | Use semantic chunking + MiniLM embeddings |
| Token usage high | Implement features in phases, cache responses |
| User confusion | Keep UI minimal and clean |
| Backend errors | Add health checks and structured logging |

### Quality Gates

Before any PR merge:
1. Feature MUST work on mobile viewport (375px width minimum)
2. No console errors in browser
3. Health checks MUST pass
4. RAG responses MUST cite source chunks
5. Free-tier usage MUST be verified

## Governance

This constitution supersedes all other development practices for this project. Amendments require:

1. Clear documentation of proposed change
2. Impact assessment on existing features
3. Verification that change does not violate constraints
4. Version increment according to semantic versioning:
   - MAJOR: Principle removal or fundamental redefinition
   - MINOR: New principle or section added
   - PATCH: Clarifications and non-semantic changes

All code reviews MUST verify compliance with these principles. Complexity additions MUST be justified against Principle I (Simplicity First).

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
