# Research: Textbook Content Generation

**Date**: 2025-12-15
**Branch**: `001-textbook-generation`

## 1. Docusaurus + React Stack

### Decision
Use Docusaurus 3.9 with React 19 and TypeScript for the frontend static site.

### Rationale
- Docusaurus provides built-in MDX support for interactive components
- React 19 is the default for new Docusaurus 3.7+ projects
- Static site generation (SSG) ensures fast mobile load times
- Built-in i18n support with RTL for Urdu

### Alternatives Considered
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Next.js | SSR flexibility | Heavier, more complex | Over-engineering for textbook |
| Gatsby | Good DX | Plugin ecosystem complexity | Docusaurus simpler for docs |
| Plain React | Full control | No doc features | Reinventing the wheel |

### Key Configuration
```javascript
// docusaurus.config.js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ur'],
  localeConfigs: {
    ur: { label: 'اردو', direction: 'rtl' }
  }
}
```

---

## 2. RAG Chatbot Architecture

### Decision
Use Qdrant Cloud + all-MiniLM-L6-v2 embeddings with recursive character chunking.

### Rationale
- **Qdrant Free Tier**: 1GB storage, ~1M vectors (sufficient for multiple textbooks)
- **MiniLM-L6-v2**: 384-dim, 22.7M params, fast on CPU, proven accuracy
- **Chunking**: Recursive splitting preserves textbook structure (headings, paragraphs)

### Alternatives Considered
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Pinecone | Popular | Expensive, free tier limited | Cost exceeds $0 budget |
| ChromaDB | Local, free | No managed hosting | Need cloud for deployment |
| MPNet | Higher accuracy | 110M params, slower | Violates Simplicity First |

### Chunking Strategy
```
Chunk Size: 400-512 tokens
Overlap: 50-100 tokens (10-20%)
Separators: ["\\n## ", "\\n### ", "\\n\\n", ". ", " "]
```

### Grounding Prompts
```
System: "Answer ONLY from provided textbook excerpts.
- Include [SOURCE: Chapter X, Section Y] citations
- If not in textbook: 'This topic is not covered in the materials'
- Never guess or use external knowledge"
```

---

## 3. Authentication with Better-Auth

### Decision
Use Better-Auth with email/password, Neon PostgreSQL, and Resend for emails.

### Rationale
- Better-Auth provides React hooks and session management out of the box
- Neon free tier (0.5GB) sufficient for user data (~100 users)
- Resend free tier (3000 emails/month) covers password resets

### Alternatives Considered
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Auth0 | Full-featured | Free tier limited | Complexity, cost at scale |
| Clerk | Good DX | Pricing after trial | Not free |
| NextAuth | Popular | Tied to Next.js | Using Docusaurus |

### Session Configuration
```typescript
session: {
  expiresIn: 7 * 24 * 60 * 60,  // 7 days
  updateAge: 24 * 60 * 60,       // Daily refresh
  cookieCache: { enabled: true, maxAge: 5 * 60 }
}
```

---

## 4. Neon PostgreSQL Free Tier

### Decision
Use Neon free tier for user data, preferences, and quiz attempts.

### Rationale
- 0.5GB storage sufficient for ~2000 users + quiz history
- Connection pooling via PgBouncer prevents connection limits
- Serverless auto-suspend saves compute hours

### Limits Validated
| Resource | Limit | Usage Estimate |
|----------|-------|----------------|
| Storage | 0.5 GB | ~50-100 MB for MVP |
| Compute | 100 CU-hours/month | ~30 CU-hours for ~100 users |
| Branches | 10 | 1 main + 2 dev |
| Egress | 5 GB/month | ~1-2 GB for API responses |

### Connection String
```
postgresql://user:pass@project.neon.tech/db?sslmode=require&connection_limit=5
```

---

## 5. Email Service

### Decision
Use Resend for transactional emails (password reset, verification).

### Rationale
- 3000 emails/month free (supports ~100 users with resets)
- Simple API, React-friendly
- No domain verification required for testing

### Alternatives Considered
| Option | Free Tier | Rejected Because |
|--------|-----------|------------------|
| SendGrid | 100/day (60 days) | Trial expires |
| AWS SES | 62K/month (1 year) | Complex setup |
| Mailgun | 5K/month | Email bounce handling complex |

---

## 6. Personalization Strategy

### Decision
AI-powered content adaptation at request time, not pre-generated variants.

### Rationale
- Avoids 3x content storage (beginner/intermediate/expert versions)
- Single source of truth for content updates
- Leverages LLM for dynamic adaptation

### Implementation Pattern
```typescript
// Request content with user's background level
const personalizedContent = await adaptContent(
  chapterMarkdown,
  user.backgroundLevel // beginner | intermediate | expert
);
```

---

## 7. Quiz Generation

### Decision
Pre-generate quizzes from chapter content, store as JSON, validate client-side.

### Rationale
- Pre-generation avoids LLM latency during quiz taking
- JSON format enables offline-first quiz experience
- Client-side validation reduces server load

### Quiz Format
```json
{
  "chapterId": "ch1",
  "questions": [
    {
      "id": "q1",
      "text": "What is Physical AI?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "..."
    }
  ]
}
```

---

## 8. Deployment Architecture

### Decision
Vercel for both frontend and backend (serverless functions).

### Rationale
- Free tier includes 6000 build minutes/month
- Automatic CDN for static Docusaurus assets
- Serverless functions for API endpoints
- Built-in preview deployments

### Alternatives Considered
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Netlify | Good free tier | Function limits | Vercel better for full-stack |
| Railway | Easy containers | Costs after free tier | Not $0 |
| Cloudflare | Edge performance | Workers complexity | Simpler on Vercel |

---

## Summary of Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| Frontend framework | Docusaurus 3.9 + React 19 |
| Vector database | Qdrant Cloud free tier |
| Embedding model | all-MiniLM-L6-v2 (384-dim) |
| Chunking strategy | Recursive, 400-512 tokens |
| Auth provider | Better-Auth + Neon |
| Email service | Resend (3000/month) |
| Deployment | Vercel (frontend + serverless) |
| Personalization | AI-powered at request time |
| Quiz storage | Pre-generated JSON |
