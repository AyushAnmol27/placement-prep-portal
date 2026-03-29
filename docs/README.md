# Placement Prep Portal

A full-stack web app to help students prepare for placements — track DSA problems, take mock tests, and manage notes.

## Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Recharts
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT
- **File Storage**: Cloudinary

## Features
- 🔐 JWT Authentication (Register / Login)
- 💻 DSA Problem tracker with difficulty filters & pagination
- 🔥 Daily streak tracking
- 📝 Notes with file attachments (PDF/Image via Cloudinary)
- 📋 Mock Tests with timer, scoring & explanations
- 📊 Progress chart (Pie chart by difficulty)

## Project Structure
```
placement-prep-portal/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, error, upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Business logic
│   └── utils/          # server.js, app.js, helpers
└── frontend/
    └── src/
        ├── components/ # Reusable UI components
        ├── context/    # Auth context
        ├── hooks/      # Custom hooks
        ├── pages/      # Page components
        ├── routes/     # App entry & routing
        ├── services/   # API calls
        └── utils/      # Helpers
```

## Setup

### Backend
```bash
cd backend/utils
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Frontend
```bash
cd frontend/src/routes
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000
