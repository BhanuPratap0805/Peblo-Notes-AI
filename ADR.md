# ADR.md — Architecture Decision Record
# Peblo Notes — Collaborative AI Workspace

> This document records all significant technical decisions made during development.
> Written before coding begins to enforce intentional architecture choices.

---

## Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR for public /shared pages; single-repo full-stack; Vercel-native |
| Language | TypeScript (strict) | Type safety prevents runtime bugs; Prisma generates types automatically |
| Database | PostgreSQL via Supabase | Relational model fits User→Note relationship; free hosted tier; Prisma ORM |
| Auth | Custom JWT + bcrypt | Demonstrates understanding of token lifecycle vs. opaque auth services |
| Token storage | httpOnly cookie | Prevents XSS token theft vs. localStorage |
| AI Provider | OpenAI GPT-4o-mini | Cost-effective; streaming API; reliable; fast inference |
| AI Delivery | SSE (Server-Sent Events) | Token-by-token streaming UX; no polling overhead |
| Share IDs | nanoid(10) | Cryptographically random; 62^10 = 839 trillion possibilities; unguessable |
| Input Validation | Zod | Runtime type safety; inferred TypeScript types; composable schemas |
| Deployment | Vercel + Supabase free tier | Zero-config Next.js deploy; live URL in <10 minutes |

---

## Key Decisions & Rationale

### 1. Full-stack Next.js (not separate Express backend)
**Decision:** Use Next.js API routes instead of a separate Express server.  
**Why:** Reduces operational overhead (single deployment), eliminates CORS issues, and allows SSR/API to share Prisma types natively. For this scope, a separate backend adds complexity with no benefit.

### 2. JWT in httpOnly cookies (not localStorage)
**Decision:** Store JWT in `httpOnly; Secure; SameSite=Strict` cookie.  
**Why:** localStorage is readable by any JavaScript on the page — XSS can steal tokens. httpOnly cookies are invisible to JS. CSRF is mitigated by SameSite=Strict.

### 3. Zod validation on all API inputs
**Decision:** All POST/PATCH bodies pass through Zod schemas before touching the database.  
**Why:** Prevents injection attacks via malformed input; provides typed errors for client display; catches schema mismatches at runtime.

### 4. Ownership check on every note mutation
**Decision:** All note queries include `where: { id, userId }` — userId from JWT header, never from the request body.  
**Why:** Prevents IDOR (Insecure Direct Object Reference) — a user should never be able to read or modify another user's notes even if they guess the ID.

### 5. nanoid for share links (not UUID or auto-increment)
**Decision:** `shareId = nanoid(10)` — separate from the note's primary ID.  
**Why:** Using the note's UUID as the share ID would expose it in URLs and enable IDOR. nanoid generates a separate, short, unguessable token. Auto-increment integers are trivially enumerable.

### 6. Streaming AI responses via ReadableStream
**Decision:** AI endpoint returns a streaming `text/plain` response; client reads via `fetch` + `ReadableStream`.  
**Why:** Users see tokens appear in real-time (<100ms to first token) vs waiting 3-5s for a blocking response. This is the key UX differentiator from other submissions.

---

## API Contract (Summary)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login, set JWT cookie |
| POST | /api/auth/logout | ✅ | Clear JWT cookie |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/notes | ✅ | List notes (search, filter, sort) |
| POST | /api/notes | ✅ | Create note |
| GET | /api/notes/:id | ✅ | Get single note |
| PATCH | /api/notes/:id | ✅ | Update note |
| DELETE | /api/notes/:id | ✅ | Delete note |
| POST | /api/notes/:id/share | ✅ | Generate share link |
| DELETE | /api/notes/:id/share | ✅ | Revoke share link |
| POST | /api/notes/:id/generate | ✅ | Stream AI generation |
| GET | /api/insights | ✅ | Productivity dashboard data |
| GET | /shared/:shareId | ❌ | Public note view (SSR) |

---

## Environment Variables Required

```
DATABASE_URL       # Supabase PostgreSQL connection string (pgBouncer URL)
DIRECT_URL         # Supabase direct URL (for migrations)
JWT_SECRET         # 256-bit random string (openssl rand -base64 32)
JWT_EXPIRES_IN     # Token lifetime (7d)
OPENAI_API_KEY     # OpenAI API key (server-side only, never NEXT_PUBLIC_)
NEXT_PUBLIC_APP_URL # Public app URL
```

---

_Last updated: Phase 0 planning — before first code commit._
