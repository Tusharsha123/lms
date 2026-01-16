# 🚀 CareerLaunch Platform - Quick Start Guide

## Getting Started

### 1. **Start the Dev Server**

```bash
cd c:\dev\lms-coding-platform
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📍 Main Pages

### **Landing Page** → `http://localhost:3000/landing`

- Hero section with platform overview
- Feature showcase
- Call-to-action buttons for signup
- Success statistics

### **Dashboard** → `http://localhost:3000/dashboard` (Requires Login)

Main hub after authentication with:

- Career statistics (Applications, Saved Jobs, Interviews, Offers)
- Quick access to all features
- Progress overview
- Recent applications list
- Recommended job opportunities

---

## 🎯 Core Features

### **1. Internship Discovery** → `/dashboard/internships`

- Search internships by role or company
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Filter by industry (Technology, Data Science, Finance, Design)
- View job details (skills, location, stipend, applicants)
- Save jobs to wishlist
- Apply to internships

**Mock Data**: 6 internship listings

---

### **2. Resume Builder** → `/dashboard/resume-builder`

- Select from 4 professional templates:
  - ⚪ Modern Minimal
  - 🎨 Creative Bold
  - 📘 Professional Classic
  - 💻 Tech Focused

**Step-by-Step Process**:

1. Choose template
2. Enter personal info (name, email, phone, location, summary)
3. Add work experience (multiple entries supported)
4. Add education details (multiple entries supported)
5. Add skills (with add/remove functionality)
6. Preview complete resume
7. Download as PDF or share

---

### **3. Application Tracker** → `/dashboard/applications`

Track all job applications with:

- **Status Badges**: Pending (blue), Interviewed (purple), Offered (green), Rejected (red)
- **Statistics**: Total, Pending, Interviewed, Offered, Rejected counts
- **Filter Options**: View by status or all applications
- **Details**: Company, role, application date, days since application
- **Actions**: View details, edit status, schedule follow-up, accept offer

**Mock Data**: 6 applications at different stages

---

### **4. Mock Interview Practice** → `/dashboard/interview`

Prepare for interviews with three modes:

#### **Interview Sessions**

Pre-built sessions with different focuses:

- Behavioral Interview 101 (15 min, Beginner)
- Technical Deep Dive (20 min, Intermediate)
- FAANG Prep (30 min, Advanced)
- Startup Focus (25 min, Intermediate)

#### **Random Questions Mode**

- 5 practice questions
- Mix of behavioral, technical, and general questions
- Tips for each question
- Sample answers for reference
- Recording capability (visual only)
- AI-powered feedback with:
  - Score (out of 100)
  - Strengths identification
  - Areas for improvement
  - Personalized comments

#### **Practice History**

- View all previous practice attempts
- Check scores and feedback
- Review past performance

**Mock Data**: 5 interview questions, 3 previous attempts

---

## 🔑 Authentication

### Create an Account

1. Click "Get Started" on landing page
2. Go to `/auth/signup`
3. Fill in email and password
4. Verify email (check console in dev mode for verification link)
5. Login with credentials

### For Quick Testing

Use the pre-created test account:

- **Email**: `test@example.com`
- **Password**: `password123`

**To create**: Run `node create-test-user-dev.js`

---

## 🎨 Design System

### Colors

- **Primary**: Slate Blue `#334155`
- **Accent**: Warm Teal `#14b8a6`
- **Background**: Soft White `#fafbfc`

### Key Design Elements

- Gradient backgrounds (slate blue → teal)
- Soft shadows for depth
- Color-coded badges and status indicators
- Smooth hover animations
- Generous whitespace
- Responsive grid layouts

---

## 📊 Mock Data Overview

### Internships (6 total)

- TechCorp (Frontend Intern)
- DataStack (Data Analyst Intern)
- CloudSys (Backend Engineer Intern)
- FinanceAI (ML Engineer Intern)
- DesignStudio (UI/UX Designer Intern)
- InnovateLabs (Full Stack Developer Intern)

### Applications (6 total)

- TechCorp → Pending
- DataStack → Interviewed
- CloudSys → Rejected
- FinanceAI → Offered
- DesignStudio → Pending
- InnovateLabs → Interviewed

### Interview Questions (5 total)

1. Tell me about a difficult team member (Behavioral)
2. Explain let, const, and var (Technical)
3. Describe biggest achievement (Behavioral)
4. Binary search time complexity (Technical)
5. Why this internship? (General)

---

## 🔗 Navigation

From any dashboard page, use the header navigation to access:

- Dashboard (home icon)
- Find Jobs (Internship Discovery)
- Applications (Application Tracker)
- Resume (Resume Builder)

---

## 🛠️ Development Tips

### Add Mock Data

Modify the mock data arrays in each component file:

- `interviewQuestions` in `interview.js`
- `internships` in `internships.js`
- `applications` in `applications.js`

### Customize Colors

Update the color palette in `styles/globals.css`:

```css
--slate-900: #0f172a;
--teal-600: #14b8a6;
--white: #fafbfc;
```

### Add New Features

1. Create new component file in `pages/dashboard/`
2. Import and use components from `components/`
3. Add NextAuth session check for authentication
4. Add link in dashboard navigation

---

## 📱 Responsive Design

All pages are fully responsive using Tailwind CSS:

- **Mobile**: Single column layout, optimized touch targets
- **Tablet**: 2-column layout where appropriate
- **Desktop**: Full multi-column layout

---

## 🔐 Session Management

The platform uses NextAuth.js for session management:

- Sessions persist across page refreshes
- Automatic logout after session expiry (30 days)
- Session data includes user email and name
- Protected routes redirect to signin page

---

## 🚀 Production Deployment

### Before Deploying

1. Update environment variables in `.env.production`
2. Disable development console logging in `lib/email.js`
3. Configure real email service (Gmail, SendGrid, Brevo)
4. Set up proper database connection
5. Configure payment processing
6. Add environment-specific API endpoints

### Deployment Platforms

- Vercel (recommended for Next.js)
- Netlify
- AWS
- DigitalOcean

---

## 📞 Support

For issues or questions:

1. Check the browser console for errors
2. Verify NextAuth configuration
3. Check database connection
4. Review `.env.local` settings
5. Test with different browsers

---

## 📋 Checklist

- [ ] Landing page displays correctly at `/landing`
- [ ] Can signup and login
- [ ] Dashboard loads with all statistics
- [ ] Can search/filter internships
- [ ] Can build resume step-by-step
- [ ] Can view application tracker
- [ ] Can practice interviews
- [ ] All navigation links work
- [ ] Responsive on mobile/tablet
- [ ] No console errors

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Use ✨
