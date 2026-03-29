# 🎯 PlacementPrep Portal

A full-stack placement preparation platform for students — DSA problems with code editor, aptitude practice, company prep, mock tests, notes, and blog.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + React Router v6 + Recharts |
| Backend | Node.js + Express + MongoDB (Mongoose) |
| Auth | JWT (7-day) + bcryptjs |
| File Storage | Cloudinary |
| Code Execution | Judge0 via RapidAPI |
| Deployment | Frontend → Cloudflare Pages · Backend → Vercel |

## Features

- 💻 **Programming** — DSA problem tracker with integrated code editor (JS, Python, Java, C++, C)
- 🧠 **Aptitude** — Quantitative, Logical Reasoning, Verbal, Data Interpretation practice
- 🏢 **Company Prep** — Company-specific problems, interview process, roles & packages
- 📋 **Mock Tests** — Timed tests with scoring and explanations
- 📝 **Notes** — Rich notes with Cloudinary file attachments
- ✍️ **Blog** — Interview experiences and placement tips
- 🔥 **Streak Tracking** — Daily activity streaks
- 📊 **Analytics** — Progress charts by difficulty

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL
npm install
npm run dev
```

### Seed Data
```bash
cd scripts
node seedProblems.js
node seedAptitude.js
node seedCompanies.js
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JUDGE0_API_KEY=your_rapidapi_key
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/problems | List problems |
| POST | /api/problems/run | Execute code |
| POST | /api/problems/:id/solve | Mark solved |
| GET | /api/aptitude | List aptitude questions |
| POST | /api/aptitude/:id/submit | Submit answer |
| GET | /api/companies | List companies |
| GET | /api/tests | List mock tests |
| POST | /api/tests/:id/submit | Submit test |
| GET/POST | /api/notes | Notes CRUD |
| GET/POST | /api/blogs | Blog CRUD |

## Docs

- [API Docs](docs/api-docs.md)
- [DB Schema](docs/db-schema.md)
- [Architecture](docs/architecture.md)
- [System Design](docs/system-design.md)
- [Feature Roadmap](docs/feature-roadmap.md)
