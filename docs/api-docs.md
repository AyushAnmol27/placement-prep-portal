# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

## Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login user |
| GET | /auth/profile | Yes | Get profile + solved problems |
| PUT | /auth/profile | Yes | Update name/password |

## Problems
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /problems | Yes | List problems (filter: difficulty, tag, search, page) |
| GET | /problems/:id | Yes | Get single problem |
| POST | /problems | Yes | Create problem |
| POST | /problems/:id/solve | Yes | Mark as solved, updates streak |

## Notes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /notes | Yes | Get user's notes |
| POST | /notes | Yes | Create note (multipart/form-data) |
| PUT | /notes/:id | Yes | Update note |
| DELETE | /notes/:id | Yes | Delete note + Cloudinary file |

## Tests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /tests | Yes | List tests (filter: category) |
| GET | /tests/:id | Yes | Get test (no correct answers) |
| POST | /tests | Yes | Create test |
| POST | /tests/:id/submit | Yes | Submit answers, get score + results |
