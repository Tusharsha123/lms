# AGENTS.md - LMS Coding Platform

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client (run after schema changes)
- `npm run prisma:migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm install` - Install dependencies (run after pulling changes)

## Architecture
- **Framework**: Next.js 16 with Pages Router (`pages/`)
- **Database**: SQLite via Prisma ORM (21 models including User, Course, Lesson, Review, Order, Certificate, Discussion)
- **Auth**: NextAuth.js with Prisma adapter (credentials + GitHub/Google OAuth)
- **Payments**: Stripe for payments, Stripe Connect for instructor payouts
- **Code Execution**: Piston API (10+ languages supported)
- **Components**: `components/` - 19 React components (Button, Card, Header, RatingStars, ReviewCard, ProgressBar, etc.)
- **API Routes**: `pages/api/` - REST endpoints for auth, courses, lessons, enrollments, reviews, payments, certificates, discussions, admin
- **Lib**: `lib/` - Helpers (prisma.js, stripe.js, email.js, codeRunner.js, notifications.js, pdf.js, storage.js)

## Code Style
- JavaScript (.js) with ES modules, no TypeScript
- React functional components with hooks
- Import authOptions from `../auth/[...nextauth]` or `../../../lib/auth` in API routes
- API routes: check session with `getServerSession(req, res, authOptions)`, return JSON with status codes
- Error handling: throw errors in lib helpers, catch in API routes
- User roles: student, instructor, admin (stored in User.role)
