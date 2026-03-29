# Database Schema

## User
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | unique, required |
| password | String | bcrypt hashed |
| streak | Number | default 0 |
| lastActiveDate | Date | updated on solve |
| solvedProblems | [ObjectId] | ref: Problem |

## Problem
| Field | Type | Notes |
|-------|------|-------|
| title | String | required |
| description | String | required |
| difficulty | Enum | Easy/Medium/Hard |
| tags | [String] | |
| link | String | external URL |
| platform | Enum | LeetCode/HackerRank/etc |
| solvedBy | [ObjectId] | ref: User |

## Note
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | ref: User |
| title | String | required |
| content | String | |
| fileUrl | String | Cloudinary URL |
| filePublicId | String | for deletion |
| tags | [String] | |

## Test
| Field | Type | Notes |
|-------|------|-------|
| title | String | required |
| description | String | |
| category | Enum | DSA/Aptitude/CS Fundamentals/System Design |
| duration | Number | minutes |
| questions | [Question] | embedded |
| attempts | [Attempt] | embedded |

### Question (embedded)
| Field | Type |
|-------|------|
| question | String |
| options | [String] |
| correctAnswer | Number (index) |
| explanation | String |
