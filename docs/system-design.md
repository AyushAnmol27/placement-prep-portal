# System Design

## Architecture Overview

```
Client (React + Vite) → Cloudflare Pages
        ↓ HTTPS
Backend (Express + Node) → Vercel Serverless
        ↓
MongoDB Atlas (Database)
        ↓
Cloudinary (File Storage)
        ↓
Judge0 / RapidAPI (Code Execution)
```

## Key Design Decisions

### Authentication
- JWT tokens (7-day expiry) stored in localStorage
- Bearer token sent via Axios interceptor on every request
- 401 responses auto-redirect to /login

### Code Execution
- Stateless: code is sent to Judge0 API per request
- Rate limited to 10 requests/minute per IP
- Supports: JavaScript, Python, Java, C++, C

### File Uploads
- Notes attachments go directly to Cloudinary via Multer
- Old files deleted on note update/delete
- Max file size: 10MB

### Streak System
- Recalculated on every problem solve
- Logic: same day = no change, consecutive day = +1, gap > 1 day = reset to 1

## Scalability Considerations
- MongoDB indexes on: `email` (User), `difficulty/tags` (Problem), `category` (AptitudeQuestion)
- Pagination on all list endpoints (default limit: 20)
- Rate limiting on auth (10 req/15min) and code execution (10 req/min)
