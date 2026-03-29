# Architecture

## Overview
```
Browser (React/Vite :3000)
        │  HTTP/JSON
        ▼
Express API (:5000)
        │
   ┌────┴────┐
   │         │
MongoDB   Cloudinary
(Atlas)   (File Storage)
```

## Auth Flow
1. User registers/logs in → receives JWT (7d expiry)
2. JWT stored in localStorage
3. Axios interceptor attaches token to every request
4. Backend `protect` middleware verifies JWT on protected routes
5. On 401 → auto logout + redirect to /login

## Streak Logic
- On `POST /problems/:id/solve`:
  - If last active was yesterday → streak + 1
  - If last active was today → streak unchanged
  - If gap > 1 day → streak resets to 1

## File Upload Flow
1. Frontend sends `multipart/form-data` to `/api/notes`
2. Multer + CloudinaryStorage streams file directly to Cloudinary
3. `fileUrl` (CDN URL) and `filePublicId` saved to Note document
4. On delete/update → old file removed via `cloudinary.uploader.destroy`
