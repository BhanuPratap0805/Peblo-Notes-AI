# Sample Outputs — Peblo AI Notes

This folder contains sample API responses, AI-generated outputs, and database schema as required by the submission guidelines.

---

## 1. Example API Responses

### GET /api/notes
Returns paginated list of user's notes.

**Response:**
```json
{
  "data": [
    {
      "id": "clx4f2k0j0000uo2k8q3l4p9z",
      "title": "Meeting Notes - Product Sync",
      "content": "Discussed Q3 roadmap, assigned tasks to team...",
      "tags": ["work", "important"],
      "isArchived": false,
      "isPublic": false,
      "shareId": null,
      "aiUsageCount": 3,
      "aiTitle": "Q3 Product Roadmap Sync",
      "aiSummary": "Team discussed the Q3 roadmap focusing on AI feature rollout...",
      "aiItems": ["Finalize design by Friday", "Review PRD with PM", "Set up staging environment"],
      "updatedAt": "2026-05-17T08:30:00.000Z",
      "createdAt": "2026-05-15T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/notes
Creates a new blank note.

**Request Body:**
```json
{ "title": "Untitled Note", "content": "" }
```

**Response:**
```json
{
  "data": {
    "id": "clx4f2k0j0001uo2k9p2m5q1a",
    "title": "Untitled Note",
    "content": "",
    "tags": [],
    "isArchived": false,
    "isPublic": false,
    "aiUsageCount": 0,
    "updatedAt": "2026-05-17T09:00:00.000Z",
    "createdAt": "2026-05-17T09:00:00.000Z"
  }
}
```

---

### POST /api/notes/:id/ai
Triggers AI generation (summary / title / action items).

**Request Body:**
```json
{ "action": "summarize" }
```

**Streaming Response (SSE):**
```
data: {"chunk": "This"}
data: {"chunk": " note"}
data: {"chunk": " covers"}
data: {"chunk": " the Q3 roadmap..."}
data: [DONE]
```

---

### POST /api/notes/:id/share
Generates a public shareable link.

**Response:**
```json
{
  "data": {
    "shareId": "sh_a8b3c2d1e4f5",
    "publicUrl": "https://peblo-notes-ai-7vz5.vercel.app/shared/sh_a8b3c2d1e4f5"
  }
}
```

---

### POST /api/auth/login
Authenticates a user with email and password.

**Request Body:**
```json
{ "email": "user@example.com", "password": "securepassword" }
```

**Response:**
```json
{
  "user": {
    "id": "clx4f2k0j0000uo2k8q3l4p9z",
    "name": "Bhanu Pratap",
    "email": "user@example.com",
    "authProvider": "credentials"
  }
}
```

---

## 2. AI-Generated Summary Example

**Input Note Content:**
> "Today's standup: Fixed the login bug with JWT token expiry. Need to review the Prisma schema for performance. Also discussed adding real-time collaboration using WebSockets. Team velocity is good, sprinting towards the Q3 deadline."

**AI Summary Output:**
> "The standup covered a resolved JWT login bug, an upcoming Prisma schema performance review, and a proposal for real-time collaboration via WebSockets. The team is on track for the Q3 deadline."

**AI Action Items Output:**
1. Review Prisma schema for performance bottlenecks
2. Prototype WebSocket integration for real-time collaboration
3. Monitor JWT token expiry edge cases in production

**AI Title Suggestion:**
> "Standup: JWT Fix, Prisma Review & WebSocket Proposal"

---

## 3. Database Schema

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  password     String?
  authProvider String   @default("credentials")
  notes        Note[]
  createdAt    DateTime @default(now())
}

model Note {
  id           String   @id @default(cuid())
  title        String   @default("Untitled")
  content      String   @default("") @db.Text
  tags         String[]
  isArchived   Boolean  @default(false)
  isPublic     Boolean  @default(false)
  shareId      String?  @unique
  aiSummary    String?  @db.Text
  aiItems      String[]
  aiTitle      String?
  aiUsageCount Int      @default(0)
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  updatedAt    DateTime @updatedAt
  createdAt    DateTime @default(now())

  @@index([userId, updatedAt(sort: Desc)])
  @@index([shareId])
}
```

---

## 4. Application Screenshots

Screenshots of the application can be found in the `sample_outputs/screenshots/` folder (if included), or by visiting the live demo at:
**https://peblo-notes-ai-7vz5.vercel.app/**
