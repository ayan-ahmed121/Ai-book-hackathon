# Quickstart: AI-Native Textbook

Get the textbook platform running locally in 5 minutes.

## Prerequisites

- Node.js 20+ (`node --version`)
- pnpm (`npm install -g pnpm`)
- Git

## 1. Clone and Install

```bash
git clone <repository-url>
cd Ayan-hackathon
pnpm install
```

## 2. Environment Setup

Create `.env` files:

```bash
# backend/.env
DATABASE_URL=postgresql://user:pass@project.neon.tech/db?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
RESEND_API_KEY=re_xxxxxxxxxxxx
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
OPENAI_API_KEY=sk-xxxx  # For content personalization

# frontend/.env
REACT_APP_API_URL=http://localhost:3001
```

## 3. Database Setup

```bash
# Generate Drizzle migrations
cd backend
pnpm drizzle-kit generate:pg

# Push to Neon
pnpm drizzle-kit push:pg
```

## 4. Start Development Servers

```bash
# Terminal 1: Backend API
cd backend
pnpm dev

# Terminal 2: Frontend Docusaurus
cd frontend
pnpm start
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 5. Seed Content (First Time)

```bash
# Generate embeddings for chapters
cd backend
pnpm seed:embeddings

# Generate quizzes
pnpm seed:quizzes
```

## Quick Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev servers |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests |
| `pnpm lint` | Check code quality |
| `pnpm db:studio` | Open Drizzle Studio |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── api/        # API endpoints
│   │   ├── db/         # Database schema
│   │   └── services/   # Business logic
│   └── tests/
├── frontend/
│   ├── docs/
│   │   └── chapters/   # MDX chapter files
│   ├── src/
│   │   ├── components/ # React components
│   │   └── theme/      # Docusaurus customization
│   └── i18n/ur/        # Urdu translations
└── content/
    ├── chapters/       # Source content
    └── quizzes/        # Generated quizzes
```

## Common Tasks

### Add a New Chapter

1. Create `frontend/docs/chapters/ch-N-title.mdx`
2. Run `pnpm seed:embeddings` to index for RAG
3. Run `pnpm seed:quizzes` to generate quiz

### Test the Chatbot

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is Physical AI?"}'
```

### Check Health

```bash
curl http://localhost:3001/api/health
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)

Set these in Vercel dashboard:
- `DATABASE_URL` - Neon connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `RESEND_API_KEY` - From Resend dashboard
- `QDRANT_URL` - Qdrant Cloud cluster URL
- `QDRANT_API_KEY` - Qdrant API key

## Troubleshooting

### "Connection refused" on API calls
- Ensure backend is running on port 3001
- Check `REACT_APP_API_URL` in frontend/.env

### "Rate limit exceeded" on chatbot
- Free tier limit reached
- Wait or upgrade Qdrant/OpenAI tier

### Urdu not displaying correctly
- Ensure `direction: 'rtl'` in docusaurus.config.ts
- Check font includes Urdu characters

## Resources

- [Docusaurus Docs](https://docusaurus.io/docs)
- [Better-Auth Docs](https://www.better-auth.com/docs)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [Neon Docs](https://neon.tech/docs)
