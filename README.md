# Peblo AI Notes

Peblo AI Notes is a visually stunning, dual-themed note-taking application powered by Next.js and Artificial Intelligence. It was built as a submission for the Full Stack Developer Challenge.

It provides a rich notes workspace with intelligent auto-saving, seamless tag organization, sophisticated searching capabilities, and an integrated "AI Co-Pilot" for text summarization, action-item extraction, and smart title generation.

## Features

- **Robust Authentication:** Secure custom JWT-based stateless authentication using HTTP-Only cookies with `bcryptjs` password hashing.
- **Dual Themes:** Toggle flawlessly between two entirely distinct visual modes:
  - **Doodle Workshop:** A playful, light, hand-drawn aesthetic using `Kalam` and `Permanent Marker` fonts.
  - **Retro Arcade:** A high-contrast, cyberpunk dark mode with pixelated borders, glowing text, and strict monospace typing.
- **AI Co-Pilot:** Instant, streaming AI assistance using Gemini 2.5 Flash to summarize notes, extract actions, and suggest titles.
- **Intelligent Organization:** Add custom tags, archive old notes, and seamlessly perform case-insensitive partial searches across note titles, contents, and tags.
- **Auto-Save:** Notes automatically save as you type, with visual cues to ensure you never lose data.
- **Productivity Insights:** A dashboard visualizing your total notes, recently active notes, AI usage, and most frequent tags.
- **Public Sharing:** Generate public, read-only URLs to securely share specific notes without requiring the viewer to log in.

## System Architecture

The application is built around a modern Next.js 15+ architecture prioritizing speed, developer experience, and UX:

- **Frontend:** Next.js (App Router), React 19, and `lucide-react`. Styling is achieved via a hybrid approach using TailwindCSS for layout geometry and a custom `globals.css` dual-theme methodology for heavy aesthetic overrides (ensuring no CSS hydration conflicts).
- **Backend APIs:** Next.js Route Handlers (`app/api/*`) provide RESTful endpoints for Notes CRUD and Authentication. Route protections are handled natively via Next.js Middleware.
- **Database:** PostgreSQL.
- **ORM & Data Layer:** Prisma Client integrated with `@prisma/adapter-pg` for optimal connection pooling and fast queries.
- **AI Streaming:** `@google/genai` logic providing Server-Sent Events (SSE) back to the client for immediate generative text rendering.
- **State Management:** Complex component state (like debounced API calls and optimistic UI updates for tags/archiving) are managed natively via React Hooks (`useState`, `useCallback`, `useEffect`).

## Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Local or remote, e.g., Supabase/Neon)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd peblo-notes
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and populate it with the required keys (see `.env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/peblonotes"
JWT_SECRET="super-secret-key-for-jwt-signing"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Database Setup
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```
*(Optional: If you wish to seed dummy data, you can build a seed script, though the app works beautifully starting fresh!)*

### 5. Running the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Submission Notes

- **Archive Feature:** The archive toggle logic is fully operational from both the individual note editor and the main dashboard.
- **Hydration & Themes:** Implemented a `mounted` state safeguard to prevent the dreaded Next.js hydration flash between light and dark modes on initial page load.

---
*Developed for the Full Stack Developer Challenge.*
