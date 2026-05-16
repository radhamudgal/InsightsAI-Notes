# InsightsAI Notes

AI-powered notes app built with React, Node.js, MongoDB, and Groq AI.

---

## Getting Started
## Project Architecture

```
insightsai-notes/
├── backend/
│   ├── controllers/    # business logic (auth, notes, ai, dashboard)
│   ├── middleware/     # JWT auth check
│   ├── models/         # Mongoose schemas — User, Note
│   ├── routes/         # Express route definitions
│   ├── services/       # Groq AI service (API key stays server-side)
│   └── server.js       # entry point — connects DB and starts server
│
└── frontend/
    └── src/
        ├── components/ # reusable UI — Sidebar, NoteCard, AIPanel, etc.
        ├── pages/      # full pages — Notes, Editor, Dashboard, Login
        ├── services/   # Axios instance + AI request wrappers
        └── store/      # Zustand global state — auth, notes, theme
```

The backend follows **MVC** — routes map URLs to controllers, controllers handle logic, models define the data shape.  
The frontend uses **Zustand** for global state with three isolated stores (auth, notes, theme).  
All AI calls go through the backend service so the API key never reaches the browser.

---

## Tech Stack
### 1. Clone the repo

```bash
git clone https://github.com/your-username/insightsai-notes.git
cd insightsai-notes
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env`:

```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=any_random_string
LLM_API_KEY=your_groq_api_key
```

Get your free Groq key at [console.groq.com](https://console.groq.com)  
Get your free MongoDB URI at [mongodb.com/atlas](https://www.mongodb.com/atlas)

> Do not commit real credentials.

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run the app

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS, Zustand, React Router
- **Backend** — Node.js, Express, MongoDB, Mongoose, JWT
- **AI** — Groq API (Llama 3.3 70B)

---

## Features

- JWT authentication with protected routes
- Create, edit, delete, pin, archive notes
- Auto-save, tags, categories, search, color themes
- AI summary, action items, title suggestions
- Public shareable note links
- Dashboard with charts and analytics
- Dark / light mode toggle
