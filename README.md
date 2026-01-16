# LMS Coding Platform

A complete, production-ready Learning Management System for coding education built with Next.js, Prisma, and NextAuth.

## ✅ Features Implemented

### User Management

- ✅ User registration with email validation
- ✅ Multi-provider authentication (Email, GitHub, Google OAuth)
- ✅ User profiles with skills, bio, and location
- ✅ Role-based access control (Student, Instructor, Admin)

### Course Management

- ✅ Create and manage courses
- ✅ Course categorization and levels
- ✅ Structured lessons system
- ✅ Course enrollment tracking
- ✅ Progress monitoring

### Learning Features

- ✅ Interactive Monaco Code Editor
- ✅ Code submission system
- ✅ Lesson content with descriptions
- ✅ Video support
- ✅ Code templates for lessons

### Admin Dashboard

- ✅ User statistics
- ✅ Course analytics
- ✅ Enrollment tracking
- ✅ User management

### UI/UX

- ✅ Professional landing page
- ✅ Reusable component library (Button, Input, Card, Modal, Sidebar, Header)
- ✅ Beautiful CSS design system
- ✅ Responsive mobile design
- ✅ Consistent styling with CSS variables

## Tech Stack

- **Framework**: Next.js 16
- **Frontend**: React, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Code Editor**: Monaco Editor
- **OAuth**: GitHub & Google

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Local development (SQLite)

For quick local development we provide a SQLite setup. Copy `.env.example` to `.env` and use the included `DATABASE_URL` for SQLite:

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL to file:./dev.db (already suggested in .env.example)
npx prisma db push
npm run dev
```

### 3. Production setup (Postgres with Docker)

This project includes a `docker-compose.yml` that starts a Postgres database and Adminer (DB UI). Use it for local production-like testing.

```bash
# start Postgres + Adminer
docker compose up -d

# copy example env and set production DATABASE_URL, NEXTAUTH_SECRET
cp .env.example .env
# Edit .env -> set DATABASE_URL to postgresql://postgres:postgres@localhost:5432/lmsdb

# Run migrations (development) or deploy migrations in production
npm run prisma:migrate
# or for deploy
npm run prisma:migrate:deploy

npm run build
npm run start:prod
```

Notes:

- Set a strong `NEXTAUTH_SECRET` in production.
- Configure SMTP (`EMAIL_SERVER_*`) for password reset and notifications.
- If enabling OAuth, fill the provider env vars in `.env`.

### 2. Configure Database

```bash
# Copy environment template
cp .env.example .env.local

# Update DATABASE_URL with your PostgreSQL connection
```

### 3. Setup Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lmsdb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (optional)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-app-password"
```

## Project Structure

```
lms-coding-platform/
├── pages/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── courses/           # Course APIs
│   │   ├── lessons/           # Lesson APIs
│   │   ├── enrollments.js     # Enrollment API
│   │   ├── profile.js         # Profile API
│   │   └── admin/             # Admin APIs
│   ├── auth/                  # Auth pages (signin, signup)
│   ├── courses/               # Course pages
│   ├── lessons/               # Lesson pages
│   ├── admin/                 # Admin dashboard
│   ├── index.js               # Landing page
│   ├── profile.js             # User profile
│   ├── my-courses.js          # Enrolled courses
│   └── _app.js                # App wrapper
├── components/                # Reusable components
│   ├── Button.js
│   ├── Input.js
│   ├── Card.js
│   ├── Header.js
│   ├── Sidebar.js
│   ├── Modal.js
│   └── Loading.js
├── styles/                    # CSS modules
│   ├── globals.css
│   ├── Button.module.css
│   ├── Input.module.css
│   └── ...
├── prisma/
│   └── schema.prisma          # Database schema
└── lib/                       # Utilities

```

## Database Schema

### User Model

- id (String)
- email (String, unique)
- name (String)
- role (String: student|instructor|admin)
- image (String)
- createdAt (DateTime)

### Profile Model

- id (String)
- userId (String, unique)
- bio (String)
- avatar (String)
- location (String)
- skills (String[])
- education (String)

### Course Model

- id (String)
- title (String)
- description (String)
- level (String: beginner|intermediate|advanced)
- category (String)
- instructorId (String)
- duration (Int)
- price (Float)
- isPublished (Boolean)

### Lesson Model

- id (String)
- title (String)
- description (String)
- content (String)
- courseId (String)
- order (Int)
- codeTemplate (String)
- duration (Int)

### Enrollment Model

- id (String)
- userId (String)
- courseId (String)
- progress (Int)
- status (String)

## Key Pages & Routes

| Page            | Route             | Role       | Description             |
| --------------- | ----------------- | ---------- | ----------------------- |
| Landing         | `/`               | Public     | Home page with features |
| Courses         | `/courses`        | Public     | Browse courses          |
| Course Detail   | `/courses/[id]`   | Public     | Course info & lessons   |
| Create Course   | `/courses/create` | Instructor | Create new course       |
| Lesson          | `/lessons/[id]`   | Enrolled   | Learn with code editor  |
| Profile         | `/profile`        | Auth       | User profile & settings |
| My Courses      | `/my-courses`     | Auth       | Enrolled courses        |
| Admin Dashboard | `/admin`          | Admin      | Platform statistics     |
| Sign In         | `/auth/signin`    | Public     | Login                   |
| Sign Up         | `/auth/signup`    | Public     | Register                |

## API Endpoints

```
POST   /api/auth/signup                    # Register
GET/PUT /api/profile                       # User profile
GET/POST /api/courses                      # List/create courses
GET/PUT /api/courses/[id]                  # Course detail
POST   /api/lessons                        # Create lesson
GET/POST /api/lessons/[id]                 # Lesson detail/submit
POST   /api/enrollments                    # Enroll in course
GET    /api/enrollments                    # My enrollments
GET    /api/admin/dashboard                # Admin stats
```

## Component Library

All components are in the `components/` directory with matching CSS modules:

### Button

```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Input

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={error}
/>
```

### Card

```jsx
<Card hover className={styles.card}>
  Content here
</Card>
```

## Authentication Flow

1. User visits `/auth/signup` or `/auth/signin`
2. NextAuth processes authentication
3. Session created in database
4. Redirect to `/courses` with authenticated session
5. Protected routes check `useSession()`

## Styling System

CSS Variables defined in `styles/globals.css`:

```css
--primary: #6366f1        /* Main color */
--secondary: #8b5cf6      /* Accent color */
--success: #10b981        /* Success state */
--danger: #ef4444         /* Error state */
--dark: #1f2937           /* Dark text */
--gray: #6b7280           /* Gray text */
--light: #f3f4f6          /* Light background */
--lighter: #f9fafb        /* Lighter background */
```

## Development Workflow

### Adding a New Course (as Instructor)

1. Sign in with Instructor account
2. Visit `/courses/create`
3. Fill course details and submit
4. Navigate to course page
5. Click "Create Lesson" to add lessons

### Admin Functions

1. Sign in with Admin account
2. Visit `/admin` for dashboard
3. View statistics and manage users

### Student Learning Flow

1. Sign up/in
2. Browse `/courses`
3. Enroll in course
4. Complete lessons
5. Submit code solutions
6. Track progress in `/my-courses`

## Building for Production

```bash
npm run build
npm start
```

## Deployment Options

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t lms .
docker run -p 3000:3000 lms
```

### Traditional Hosting

```bash
npm run build
npm start
```

## Future Enhancements

- [ ] Real code execution environment
- [ ] Discussion forums
- [ ] Certificates & badges
- [ ] Email notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Live sessions
- [ ] AI-powered code assistance

## License

MIT

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using Next.js & Prisma**

What's included

- Basic Next.js app (`pages/`)
- Placeholder NextAuth API route
- Prisma schema (`prisma/schema.prisma`)

Next steps

- Choose DB hosting (local Postgres or Supabase).
- Configure NextAuth providers and session storage.
- Add course and lesson models, and the in-browser editor integration.

Windows dev note (Turbopack)

If `npm run dev` fails on Windows with Turbopack / SWC errors, disable Turbopack for local development in PowerShell:

```powershell
$env:NEXT_DISABLE_TURBOPACK = "1"
npm run dev
```

Prisma 7 config

Prisma 7 requires datasource URLs be provided via `prisma.config.ts`. Ensure you have `DATABASE_URL` in your `.env` and see `prisma.config.ts` in the repo.

Auth (Supabase magic link)

- Visit `/auth/signin` and enter an email to receive a Supabase magic link.
- `lib/supabaseClient.js` is used by client pages; `lib/supabaseAdmin.js` is for server actions.
"# lms" 
