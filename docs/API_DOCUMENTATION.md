# API Documentation

## Authentication

All authenticated endpoints require a valid session. Use NextAuth.js for authentication.

```javascript
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

const session = await getServerSession(req, res, authOptions);
```

## Internship APIs

### GET /api/internships

List all active internships with optional filters.

**Query Parameters:**
- `search` (string): Search in title and description
- `locationType` (string): ONSITE, REMOTE, HYBRID
- `type` (string): FULL_TIME, PART_TIME, PROJECT_BASED
- `status` (string): ACTIVE, CLOSED, DRAFT (default: ACTIVE)
- `company` (string): Filter by company name
- `skills` (string): Comma-separated skills
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": "abc123",
    "title": "Frontend Developer Intern",
    "description": "...",
    "company": {
      "id": "company123",
      "name": "TechCorp",
      "logo": "https://...",
      "verified": true
    },
    "location": "San Francisco, CA",
    "locationType": "HYBRID",
    "type": "FULL_TIME",
    "duration": "3 months",
    "stipend": "$2000/month",
    "skills": ["React", "JavaScript"],
    "status": "ACTIVE",
    "deadline": "2024-02-15T00:00:00.000Z",
    "applicationCount": 15
  }
]
```

### POST /api/internships

Create a new internship (admin/instructor only).

**Request Body:**
```json
{
  "companyId": "company123",
  "title": "Frontend Developer Intern",
  "description": "Join our frontend team...",
  "requirements": "- Proficiency in React\n- ...",
  "responsibilities": "- Develop features\n- ...",
  "location": "San Francisco, CA",
  "locationType": "HYBRID",
  "type": "FULL_TIME",
  "duration": "3 months",
  "stipend": "$2000/month",
  "skills": ["React", "JavaScript"],
  "deadline": "2024-02-15",
  "startDate": "2024-03-01"
}
```

### GET /api/internships/[id]

Get details of a specific internship.

**Response:**
```json
{
  "id": "abc123",
  "title": "Frontend Developer Intern",
  "description": "...",
  "requirements": "...",
  "responsibilities": "...",
  "company": { ... },
  "skills": ["React", "JavaScript"],
  "views": 234,
  "applicationCount": 15
}
```

### PUT /api/internships/[id]

Update an internship (admin/instructor only).

### DELETE /api/internships/[id]

Delete an internship (admin only).

### POST /api/internships/apply

Submit an internship application.

**Request Body:**
```json
{
  "internshipId": "abc123",
  "coverLetter": "I am excited to apply...",
  "resumeId": "resume123" // optional
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": { ... }
}
```

### GET /api/internships/applications

Get user's applications.

**Query Parameters:**
- `status` (string): Filter by status
- `limit` (number): Results per page
- `offset` (number): Pagination offset

### GET /api/internships/search

Advanced internship search with all filters.

## Mock Test APIs

### GET /api/career/mock-tests

List all published tests.

**Query Parameters:**
- `category` (string): TECHNICAL, APTITUDE, BEHAVIORAL, etc.
- `difficulty` (string): BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- `tags` (string): Comma-separated tags
- `limit` (number): Results per page
- `offset` (number): Pagination offset

**Response:**
```json
[
  {
    "id": "test123",
    "title": "JavaScript Fundamentals",
    "description": "Test your JS knowledge...",
    "category": "TECHNICAL",
    "difficulty": "BEGINNER",
    "duration": 30,
    "totalQuestions": 10,
    "passingScore": 70,
    "tags": ["JavaScript", "Programming"],
    "attemptCount": 45
  }
]
```

### POST /api/career/mock-tests

Create a new test (admin/instructor only).

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Test your knowledge...",
  "category": "TECHNICAL",
  "difficulty": "BEGINNER",
  "duration": 30,
  "totalQuestions": 10,
  "passingScore": 70,
  "questions": [
    {
      "question": "What is typeof null?",
      "options": ["null", "undefined", "object", "number"],
      "correctAnswer": 2,
      "explanation": "typeof null returns 'object'..."
    }
  ],
  "tags": ["JavaScript", "Programming"],
  "isPublished": true
}
```

### GET /api/career/mock-tests/[id]

Get test details including questions.

### POST /api/career/mock-tests/attempt

Submit a test attempt.

**Request Body:**
```json
{
  "testId": "test123",
  "answers": [0, 2, 1, 3, ...],
  "timeSpent": 25
}
```

**Response:**
```json
{
  "id": "attempt123",
  "score": 8,
  "percentage": 80,
  "passed": true,
  "timeSpent": 25,
  "feedback": [
    {
      "questionId": 0,
      "question": "What is typeof null?",
      "userAnswer": 2,
      "correctAnswer": 2,
      "isCorrect": true,
      "explanation": "..."
    }
  ]
}
```

### GET /api/career/mock-tests/results/[id]

Get results of a specific attempt.

## Workshop APIs

### GET /api/career/workshops

List workshops.

**Query Parameters:**
- `category` (string): Filter by category
- `status` (string): SCHEDULED, ONGOING, COMPLETED, CANCELLED
- `upcoming` (boolean): Show only upcoming scheduled workshops
- `limit` (number): Results per page
- `offset` (number): Pagination offset

**Response:**
```json
[
  {
    "id": "workshop123",
    "title": "Resume Writing Masterclass",
    "description": "Learn to create ATS-friendly resumes...",
    "instructor": "Jane Smith",
    "category": "Career Development",
    "duration": 120,
    "capacity": 50,
    "scheduledAt": "2024-02-20T14:00:00.000Z",
    "meetingLink": "https://meet.example.com/...",
    "status": "SCHEDULED",
    "enrollmentCount": 35,
    "availableSeats": 15
  }
]
```

### POST /api/career/workshops

Create a new workshop (admin/instructor only).

### POST /api/career/workshops/enroll

Enroll in a workshop.

**Request Body:**
```json
{
  "workshopId": "workshop123"
}
```

## Resume APIs

### GET /api/resume

Get user's resumes.

**Response:**
```json
[
  {
    "id": "resume123",
    "title": "Software Engineer Resume",
    "template": {
      "id": "template1",
      "name": "Modern Minimal",
      "category": "Technical"
    },
    "content": {
      "personalInfo": { ... },
      "experience": [ ... ],
      "education": [ ... ],
      "skills": [ ... ]
    },
    "visibility": "PRIVATE",
    "isPrimary": true,
    "applicationCount": 3
  }
]
```

### POST /api/resume/create

Create a new resume.

**Request Body:**
```json
{
  "templateId": "template1",
  "title": "Software Engineer Resume",
  "content": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA"
    },
    "experience": [
      {
        "company": "TechCorp",
        "position": "Software Engineer",
        "startDate": "2022-01",
        "endDate": "Present",
        "description": "Developed features..."
      }
    ],
    "education": [ ... ],
    "skills": ["JavaScript", "React", "Node.js"]
  },
  "visibility": "PRIVATE",
  "isPrimary": false
}
```

### GET /api/resume/[id]

Get a specific resume.

### PUT /api/resume/[id]

Update a resume.

### DELETE /api/resume/[id]

Delete a resume.

### GET /api/resume/templates

List available resume templates.

**Response:**
```json
[
  {
    "id": "template1",
    "name": "Modern Minimal",
    "description": "Clean single-column layout...",
    "structure": {
      "sections": ["header", "summary", "experience", "education", "skills"],
      "style": "minimal",
      "colors": { ... }
    },
    "category": "Technical",
    "isPremium": false,
    "popularity": 100
  }
]
```

## AI Personalization APIs

### GET /api/ai/recommendations

Get course recommendations for the user.

**Query Parameters:**
- `limit` (number): Number of recommendations (default: 10)

**Response:**
```json
[
  {
    "id": "rec123",
    "course": {
      "id": "course123",
      "title": "Advanced React Patterns",
      "description": "...",
      "instructor": { "name": "..." }
    },
    "score": 0.85,
    "reason": "Based on your interest in web development",
    "viewed": false,
    "enrolled": false
  }
]
```

### POST /api/ai/recommendations

Generate new recommendations.

**Request Body:**
```json
{
  "forceRefresh": true
}
```

### GET /api/ai/preferences

Get user preferences.

**Response:**
```json
{
  "learningStyle": "visual",
  "careerGoals": ["Full-stack Developer", "Tech Lead"],
  "interests": ["Web Development", "Cloud Computing"],
  "skillLevel": "intermediate",
  "availability": {
    "monday": ["18:00-20:00"],
    "wednesday": ["18:00-20:00"]
  },
  "preferredPace": "moderate"
}
```

### POST /api/ai/preferences

Update user preferences.

### GET /api/ai/learning-path

Get user's learning paths.

### POST /api/ai/learning-path

Create a new learning path.

**Request Body:**
```json
{
  "title": "Full-Stack Web Development",
  "description": "Master frontend and backend...",
  "goals": ["Learn React", "Master Node.js", "Deploy apps"],
  "courseIds": ["course1", "course2", "course3"],
  "recommendedBy": "AI"
}
```

### GET /api/ai/schedule

Get study schedule.

**Query Parameters:**
- `upcoming` (boolean): Show only future tasks
- `completed` (boolean): Show only completed tasks
- `limit` (number): Results per page
- `offset` (number): Pagination offset

### POST /api/ai/schedule

Create a new schedule item.

**Request Body:**
```json
{
  "title": "Complete React Course Module 3",
  "description": "Focus on hooks and state management",
  "courseId": "course123",
  "taskType": "STUDY",
  "scheduledFor": "2024-02-15T18:00:00.000Z",
  "duration": 60,
  "priority": "HIGH"
}
```

### PUT /api/ai/schedule

Update a schedule item (mark as complete).

**Request Body:**
```json
{
  "id": "schedule123",
  "completed": true
}
```

## Company APIs

### GET /api/internships/companies

List companies.

**Query Parameters:**
- `search` (string): Search company name/description
- `verified` (boolean): Filter by verification status
- `industry` (string): Filter by industry
- `limit` (number): Results per page
- `offset` (number): Pagination offset

### POST /api/internships/companies

Create a new company (admin only).

**Request Body:**
```json
{
  "name": "TechCorp",
  "description": "Leading technology company...",
  "website": "https://techcorp.com",
  "logo": "https://...",
  "location": "San Francisco, CA",
  "industry": "Technology",
  "size": "201-500"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 405: Method not allowed
- 500: Internal server error

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

Most list endpoints support pagination:
- `limit`: Number of results per page (default: 20, max: 100)
- `offset`: Number of results to skip (default: 0)

## Data Types

### String Fields
- JSON arrays/objects are stored as JSON strings in SQLite
- Parse with `JSON.parse()` when receiving
- Stringify with `JSON.stringify()` when sending

### Date Fields
- All dates are ISO 8601 strings
- Example: `"2024-02-15T14:30:00.000Z"`

### Enums (stored as strings)
- InternshipLocationType: ONSITE, REMOTE, HYBRID
- InternshipType: FULL_TIME, PART_TIME, PROJECT_BASED
- InternshipStatus: ACTIVE, CLOSED, DRAFT
- ApplicationStatus: PENDING, REVIEWING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN
- TestCategory: TECHNICAL, APTITUDE, BEHAVIORAL, DOMAIN_SPECIFIC, CODING
- Difficulty: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- WorkshopStatus: SCHEDULED, ONGOING, COMPLETED, CANCELLED
- ResumeVisibility: PRIVATE, PUBLIC, UNLISTED
- TaskType: STUDY, ASSIGNMENT, REVIEW, PRACTICE, WORKSHOP
- Priority: LOW, MEDIUM, HIGH, URGENT
