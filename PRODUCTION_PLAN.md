# LMS Marketplace - Production-Ready Implementation Plan

## Current State
✅ Core MVP complete: Auth, Courses, Lessons, Monaco Editor, Admin Dashboard, User Profiles

---

## Phase 1: Marketplace Essentials (Priority)

### 1.1 Payment System
- [ ] Stripe integration for course purchases
- [ ] Instructor payout system (Stripe Connect)
- [ ] Course pricing tiers (one-time, subscription)
- [ ] Refund management
- [ ] Invoice generation
- [ ] Tax calculation (VAT/GST)

**Files to create:**
- `pages/api/payments/checkout.js` - Create checkout session
- `pages/api/payments/webhook.js` - Handle Stripe webhooks
- `pages/api/payments/payouts.js` - Instructor payouts
- `lib/stripe.js` - Stripe client
- `pages/checkout/[courseId].js` - Checkout page
- `pages/instructor/earnings.js` - Earnings dashboard

### 1.2 Course Marketplace Features
- [ ] Course reviews & ratings (1-5 stars + text)
- [ ] Course wishlist/favorites
- [ ] Course recommendations (based on category/history)
- [ ] Featured/trending courses
- [ ] Course bundles
- [ ] Coupons & discounts
- [ ] Course preview (free lessons)

**Schema additions:**
```prisma
model Review {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())
  user      User     @relation(...)
  course    Course   @relation(...)
  @@unique([userId, courseId])
}

model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  createdAt DateTime @default(now())
  @@unique([userId, courseId])
}

model Coupon {
  id          String   @id @default(cuid())
  code        String   @unique
  discount    Int      // percentage
  maxUses     Int?
  usedCount   Int      @default(0)
  expiresAt   DateTime?
  courseId    String?  // null = all courses
  createdAt   DateTime @default(now())
}
```

### 1.3 Instructor Dashboard
- [ ] Earnings analytics (daily/weekly/monthly)
- [ ] Student analytics (enrollments, completion rates)
- [ ] Course performance metrics
- [ ] Review management
- [ ] Payout history
- [ ] Course bulk management

**Files to create:**
- `pages/instructor/index.js` - Instructor dashboard
- `pages/instructor/courses.js` - Manage courses
- `pages/instructor/analytics.js` - Analytics
- `pages/instructor/students.js` - Student list
- `pages/api/instructor/stats.js` - Stats API

---

## Phase 2: Enhanced Learning Experience

### 2.1 Code Execution Engine
- [ ] Sandboxed code execution (Judge0/Piston API)
- [ ] Multiple language support (Python, JS, Java, C++)
- [ ] Test case validation
- [ ] Execution time limits
- [ ] Memory limits
- [ ] Real-time output streaming

**Files to create:**
- `lib/codeRunner.js` - Code execution client
- `pages/api/execute.js` - Execute code API
- `pages/api/lessons/[id]/submit.js` - Submit solution

### 2.2 Progress & Gamification
- [ ] Lesson completion tracking
- [ ] Course certificates (PDF generation)
- [ ] Achievement badges
- [ ] Learning streaks
- [ ] XP/points system
- [ ] Leaderboards
- [ ] Progress milestones

**Schema additions:**
```prisma
model Certificate {
  id         String   @id @default(cuid())
  userId     String
  courseId   String
  issuedAt   DateTime @default(now())
  certificateUrl String
}

model Achievement {
  id          String   @id @default(cuid())
  userId      String
  type        String   // streak, completion, etc.
  title       String
  description String
  earnedAt    DateTime @default(now())
}

model LessonProgress {
  id         String   @id @default(cuid())
  userId     String
  lessonId   String
  completed  Boolean  @default(false)
  timeSpent  Int      @default(0) // seconds
  completedAt DateTime?
  @@unique([userId, lessonId])
}
```

### 2.3 Interactive Features
- [ ] Quizzes (multiple choice, coding challenges)
- [ ] Assignments with deadlines
- [ ] Downloadable resources
- [ ] Course notes/bookmarks
- [ ] Video timestamps/chapters

---

## Phase 3: Community & Engagement

### 3.1 Discussion System
- [ ] Course Q&A forums
- [ ] Lesson comments
- [ ] Upvoting/downvoting
- [ ] Instructor replies (marked as answer)
- [ ] @mentions and notifications

**Files to create:**
- `pages/courses/[id]/discussions.js`
- `pages/api/discussions/index.js`
- `pages/api/discussions/[id]/replies.js`
- `components/DiscussionThread.js`

### 3.2 Notifications
- [ ] In-app notifications
- [ ] Email notifications (SendGrid/Resend)
- [ ] Push notifications (web)
- [ ] Notification preferences
- [ ] Digest emails (daily/weekly)

### 3.3 Messaging
- [ ] Student-instructor messaging
- [ ] Announcement broadcasts
- [ ] Chat system (optional)

---

## Phase 4: Advanced Features

### 4.1 Live Features
- [ ] Live coding sessions (WebRTC/Daily.co)
- [ ] Screen sharing
- [ ] Live Q&A
- [ ] Scheduled events
- [ ] Webinar integration

### 4.2 AI-Powered Features
- [ ] AI code review/hints
- [ ] Personalized course recommendations
- [ ] Auto-generated quizzes
- [ ] Learning path suggestions
- [ ] Chatbot assistant

### 4.3 Content Management
- [ ] Video hosting (Mux/Cloudinary/S3)
- [ ] Video processing/transcoding
- [ ] Subtitle generation
- [ ] CDN for assets
- [ ] Rich text editor (TipTap/Slate)

---

## Phase 5: Business & Operations

### 5.1 Analytics & Reporting
- [ ] Revenue analytics
- [ ] User acquisition metrics
- [ ] Course conversion funnels
- [ ] Retention analysis
- [ ] Export reports (CSV/PDF)

### 5.2 Admin Features
- [ ] Content moderation
- [ ] User verification
- [ ] Instructor approval workflow
- [ ] Bulk operations
- [ ] System settings
- [ ] Email templates

### 5.3 SEO & Marketing
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Social sharing
- [ ] Affiliate program
- [ ] Referral system
- [ ] Landing page builder
- [ ] Blog/content marketing

---

## Phase 6: Production Infrastructure

### 6.1 Database & Storage
- [ ] Migrate SQLite → PostgreSQL (Supabase/Neon)
- [ ] Redis caching
- [ ] File storage (S3/Cloudflare R2)
- [ ] Database backups
- [ ] Connection pooling

### 6.2 Security
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] CSP headers
- [ ] Input sanitization
- [ ] Audit logging
- [ ] 2FA authentication
- [ ] Account recovery

### 6.3 Performance
- [ ] CDN (Cloudflare/Vercel Edge)
- [ ] Image optimization
- [ ] Lazy loading
- [ ] API response caching
- [ ] Database query optimization
- [ ] Bundle size optimization

### 6.4 Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alerts & notifications

### 6.5 DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Preview deployments
- [ ] Database migrations automation
- [ ] Environment management

---

## Implementation Priority Order

### Week 1-2: Payment & Marketplace
1. Stripe integration
2. Course reviews & ratings
3. Instructor earnings dashboard
4. Coupons system

### Week 3-4: Learning Enhancement
1. Code execution engine
2. Certificate generation
3. Lesson progress tracking
4. Quiz system

### Week 5-6: Community
1. Discussion forums
2. Email notifications
3. In-app notifications

### Week 7-8: Production Prep
1. PostgreSQL migration
2. File storage setup
3. Security hardening
4. Monitoring setup

### Week 9-10: Polish
1. SEO optimization
2. Performance tuning
3. Mobile responsiveness
4. Testing & bug fixes

---

## New Files Summary

### Pages (25+ new)
```
pages/
├── checkout/[courseId].js
├── instructor/
│   ├── index.js
│   ├── courses.js
│   ├── analytics.js
│   ├── students.js
│   └── earnings.js
├── courses/[id]/
│   ├── reviews.js
│   └── discussions.js
├── certificates/[id].js
├── achievements.js
├── wishlist.js
├── notifications.js
├── settings.js
└── blog/
    ├── index.js
    └── [slug].js
```

### API Routes (20+ new)
```
pages/api/
├── payments/
│   ├── checkout.js
│   ├── webhook.js
│   └── payouts.js
├── reviews/
│   └── index.js
├── wishlist/
│   └── index.js
├── coupons/
│   └── validate.js
├── execute.js
├── certificates/
│   └── generate.js
├── discussions/
│   ├── index.js
│   └── [id]/replies.js
├── notifications/
│   └── index.js
└── instructor/
    ├── stats.js
    └── students.js
```

### Components (15+ new)
```
components/
├── ReviewCard.js
├── ReviewForm.js
├── RatingStars.js
├── DiscussionThread.js
├── CommentBox.js
├── NotificationBell.js
├── ProgressBar.js
├── AchievementBadge.js
├── CertificatePreview.js
├── PriceTag.js
├── CouponInput.js
├── VideoPlayer.js
├── QuizQuestion.js
├── CodeOutput.js
└── Analytics/
    ├── Chart.js
    ├── StatCard.js
    └── RevenueGraph.js
```

### Libraries (10+ new)
```
lib/
├── stripe.js
├── codeRunner.js
├── email.js
├── storage.js
├── pdf.js
├── redis.js
├── analytics.js
├── recommendations.js
└── notifications.js
```

---

## Environment Variables (Production)

```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
S3_REGION=...

# Email
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@yourdomain.com

# Code Execution
JUDGE0_API_KEY=...
JUDGE0_URL=...

# Monitoring
SENTRY_DSN=...

# Video
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
```

---

## Estimated Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Marketplace | 2 weeks | High |
| Phase 2: Learning | 2 weeks | High |
| Phase 3: Community | 1.5 weeks | Medium |
| Phase 4: Advanced | 2 weeks | High |
| Phase 5: Business | 1.5 weeks | Medium |
| Phase 6: Infrastructure | 1 week | Medium |
| **Total** | **10 weeks** | - |

---

## Success Metrics

- [ ] 1000+ registered users
- [ ] 50+ courses published
- [ ] 95%+ uptime
- [ ] <2s page load time
- [ ] 4.5+ average course rating
- [ ] <5% refund rate
- [ ] 60%+ course completion rate

---

**Ready to implement? Run: `npm run dev` and start with Phase 1!**
