# InsightsAI Notes — AI-Powered Notes App

A full-stack notes application with AI features built as a portfolio project.  
Built with React, Node.js, Express, MongoDB, JWT authentication, and Groq AI (Llama 3.3).

---

## Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router v6, Axios, Recharts |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  |
| AI       | Groq API — `llama-3.3-70b-versatile` (free tier)       |

---

## Features

- JWT-based signup / login / logout with protected routes
- Create, edit, delete, pin, and archive notes
- Auto-save with 1.5s debounce (no manual save needed)
- Tags and categories with live filtering
- Full-text search across title, content, and tags
- Color-coded notes
- Dark / light theme toggle (persisted to localStorage)
- AI summary generation
- AI action item extraction
- AI title suggestions
- Public shareable note links (unique share ID per note)
- Productivity dashboard with bar chart, pie chart, and tag analytics

---

## Project Structure

```
notes-app/
├── backend/
│   ├── config/           # MongoDB connection helper
│   ├── controllers/      # auth, note, ai, dashboard — business logic
│   ├── middleware/        # JWT protect middleware
│   ├── models/           # Mongoose schemas (User, Note)
│   ├── routes/           # Express route definitions
│   ├── services/         # Groq AI service — API key stays server-side
│   └── server.js         # Entry point
│
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI — Sidebar, NoteCard, AIPanel, etc.
│       ├── pages/        # Full pages — Notes, Editor, Dashboard, Share
│       ├── services/     # Axios instance + AI service wrappers
│       └── store/        # Zustand stores — auth, notes, theme
│
├── .env.example
└── README.md
```

---

## Installation

### Prerequisites

Make sure you have these installed before starting:

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A free [Groq API key](https://console.groq.com)

### Step 1 — Clone the repo

```bash
git clone https://github.com/your-username/insightsai-notes.git
cd insightsai-notes
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Then open `backend/.env` and fill in the values:

```env
# EXAMPLE .ENV.EXAMPLE
# Copy this file to .env and fill in your real values
# Do not commit real credentials.

DATABASE_URL=
JWT_SECRET=
LLM_API_KEY=

# Optional — defaults shown below if not set
PORT=5000
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Where to get each value:**

| Variable       | How to get it |
|----------------|---------------|
| `DATABASE_URL` | [MongoDB Atlas](https://www.mongodb.com/atlas) → Create cluster → Connect → Drivers → copy the connection string |
| `JWT_SECRET`   | Any random string, e.g. `mysecretkey123` — just keep it private |
| `LLM_API_KEY`  | [console.groq.com](https://console.groq.com) → API Keys → Create API Key |

> Do not commit real credentials. Add `.env` to your `.gitignore`.

> The frontend has no `.env` file needed — it proxies all `/api` requests to the backend via Vite's dev server config.

---

## Running the App

You need **two terminals** open at the same time.

### Terminal 1 — Start the backend

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### Terminal 2 — Start the frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Testing the Application

There is no automated test suite — testing is done manually by walking through the features below.

### 1. Auth flow

- Go to `/signup` and create an account
- Log out, then go to `/login` and sign back in
- Try accessing `/notes` without logging in — you should be redirected to `/login`

### 2. Notes

- Click **New Note** in the sidebar
- Type a title and some content — the toolbar should show "Saving..." then "Saved" automatically after 1.5s
- Add tags by typing in the tag input and pressing **Enter** or **,**
- Change the note color using the color dots in the toolbar
- Go back to `/notes` — the note should appear in the grid
- Hover over a note card to see the pin / share / archive / delete buttons

### 3. Search and filtering

- Use the search bar to search by title, content, or tag
- Click a category pill or tag to filter notes
- Click **Archived** in the sidebar to see archived notes

### 4. AI features

- Open a note and write at least a sentence of content
- In the right sidebar, click **Generate Summary** — a summary should appear below
- Click **Extract Action Items** — a list of tasks should appear
- Click **Suggest Title** — the title input at the top should update automatically

> AI features require a valid `GROQ_API_KEY` in `backend/.env`

### 5. Public sharing

- Open a note and hover over it in the notes list, then click the share icon
- A toast should say "Share link copied!"
- Open the copied link in a new browser tab (or incognito) — the note should be visible without logging in

### 6. Dashboard

- Go to `/dashboard`
- You should see stat cards, a bar chart of notes created in the last 7 days, a category pie chart, top tags, and recently updated notes

### 7. Dark mode

- Click the moon/sun icon in the top-left of the sidebar
- The entire app should switch between light and dark themes
- Refresh the page — the theme preference should be remembered

---

## API Reference

### Auth
| Method | Endpoint          | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | `/api/auth/signup` | No  | Register a new user      |
| POST   | `/api/auth/login`  | No  | Login and receive JWT    |
| GET    | `/api/auth/me`     | Yes | Get logged-in user info  |

### Notes
| Method | Endpoint                  | Auth | Description                                      |
|--------|---------------------------|------|--------------------------------------------------|
| GET    | `/api/notes`              | Yes  | Get notes — supports `?search`, `?tag`, `?category`, `?archived` |
| POST   | `/api/notes`              | Yes  | Create a note                                    |
| PUT    | `/api/notes/:id`          | Yes  | Update a note                                    |
| DELETE | `/api/notes/:id`          | Yes  | Delete a note                                    |
| PATCH  | `/api/notes/:id/archive`  | Yes  | Toggle archive status                            |
| PATCH  | `/api/notes/:id/pin`      | Yes  | Toggle pin status                                |
| PATCH  | `/api/notes/:id/share`    | Yes  | Toggle public sharing (generates shareId)        |

### AI
| Method | Endpoint               | Auth | Description                    |
|--------|------------------------|------|--------------------------------|
| POST   | `/api/ai/summary`      | Yes  | Generate a 2-3 sentence summary |
| POST   | `/api/ai/action-items` | Yes  | Extract tasks as a JSON array  |
| POST   | `/api/ai/title`        | Yes  | Suggest a short title          |

### Other
| Method | Endpoint                  | Auth | Description                          |
|--------|---------------------------|------|--------------------------------------|
| GET    | `/api/dashboard/stats`    | Yes  | Analytics data for the dashboard     |
| GET    | `/api/share/:shareId`     | No   | View a public note (no login needed) |
| GET    | `/api/health`             | No   | Server health check                  |

---

## Database Schema

### User
```
name       String   required, trimmed
email      String   required, unique, lowercase
password   String   hashed with bcrypt (12 salt rounds)
createdAt  Date     auto
updatedAt  Date     auto
```

### Note
```
user          ObjectId   ref → User (required)
title         String     default: 'Untitled Note'
content       String     default: ''
tags          [String]   stored lowercase
category      String     default: 'general'
color         String     hex color, default: '#ffffff'
isPinned      Boolean    default: false
isArchived    Boolean    default: false
isPublic      Boolean    default: false
shareId       String     unique, sparse — auto-set by pre-save hook when isPublic = true
aiSummary     String     stored after AI call
aiActionItems [String]   stored after AI call
wordCount     Number     auto-calculated on every save
createdAt     Date       auto
updatedAt     Date       auto
```

---

## Design Decisions

**Why Groq instead of OpenAI/Gemini?**  
Groq's free tier gives 14,400 requests/day with very low latency. It runs Llama 3.3 70B which handles summarisation and extraction well without any cost.

**Why Zustand instead of Redux?**  
Redux adds a lot of boilerplate for a project this size. Zustand gives global state with minimal setup — three small stores (auth, notes, theme) cover everything cleanly.

**Why auto-save instead of a save button?**  
Better UX. A debounced `useEffect` fires a `PUT` request 1.5s after the user stops typing. A `useRef` holds the latest values so the timer always reads fresh data without stale closure issues.

**Why store AI results in MongoDB?**  
So the public shared note page can display the AI summary and action items without making another AI call. Results are persisted the moment they are generated.

**Why MVC on the backend?**  
Keeps concerns separated — routes map URLs to controllers, controllers handle logic, models define data shape. Easy to extend and straightforward to explain.

---

## Interview Talking Points

- **JWT flow** — token signed on login → stored in localStorage → attached to every request via Axios interceptor → verified in `protect` middleware
- **Auto-save** — `useRef` holds latest note values, `useEffect` debounces the save call by 1.5s to avoid hammering the API
- **AI is server-side only** — the Groq API key never reaches the browser; all AI calls go through the backend service
- **MongoDB aggregation** — dashboard uses `$group`, `$unwind`, `$sort`, and `$limit` pipelines for analytics
- **nanoid** — generates a 10-character unique `shareId` when a note is made public
- **Separate Zustand stores** — auth, notes, and theme are isolated so each store has a single responsibility
- **Dark mode** — Tailwind's `darkMode: 'class'` strategy; theme toggled by adding/removing `dark` on `<html>`, persisted to localStorage

---

## License

MIT
