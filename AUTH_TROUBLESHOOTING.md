# Authentication Troubleshooting Guide

## Quick Start

### 1. Create a Test User

```bash
node create-test-user-dev.js
```

This creates a verified test user:

- **Email:** test@example.com
- **Password:** password123

### 2. View Debug Dashboard

Visit: http://localhost:3000/auth/debug

This shows:

- All users in the database
- Email verification tokens
- Quick access to test credentials

### 3. Test Login

Visit: http://localhost:3000/auth/signin

Use the test credentials to verify login works.

---

## Common Issues & Solutions

### ❌ 401 Unauthorized Error

**Problem:** Getting `Failed to load resource: 401 Unauthorized` when trying to login

**Causes & Solutions:**

1. **No users in database**

   ```bash
   node create-test-user-dev.js
   ```

2. **User created without password hash**

   - Check debug dashboard at `/auth/debug`
   - Look for "Password Hash" column
   - If not set, user was created with OAuth only

3. **Email not verified (Production mode)**
   - In development: Email verification is NOT required
   - In production: Email verification IS required
   - Test user created with `create-test-user-dev.js` is pre-verified

---

### ❌ Email Not Sending

**Problem:** Users don't receive verification emails

**Solutions:**

1. **Check .env.local configuration**

   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password  # NOT regular password!
   EMAIL_FROM=your-email@gmail.com
   ```

2. **For Gmail:**

   - Enable 2FA on your account
   - Generate App Password at: https://myaccount.google.com/apppasswords
   - Use the 16-character password

3. **Check terminal/console for errors**

   - Email errors are logged to console in development mode
   - Look for: "Error sending email:" messages

4. **In development mode with email failure:**
   - Check terminal for fallback verification URLs
   - These URLs let you verify without email

---

### ❌ Token Expired Error

**Problem:** "Token has expired" when clicking email or reset links

**Reasons:**

- Email verification tokens expire after **24 hours**
- Password reset tokens expire after **1 hour**

**Solutions:**

1. **For email verification:**

   ```bash
   # Request a new verification email
   POST /api/auth/resend-verification
   { "email": "user@example.com" }
   ```

2. **For password reset:**
   - Go to `/auth/forgot-password` and request a new reset link

---

### ❌ Signup Not Working

**Problem:** Can't create new account

**Check:**

1. Is email already registered?

   - Visit `/auth/debug` to see all users

2. Are email credentials configured?

   - Verification email won't send without proper config
   - But account should still be created

3. Check browser console for errors
   - Look for network errors in DevTools > Network tab

---

## Development vs Production

### Development Mode (NODE_ENV=development)

✅ Users can login without email verification
✅ Fallback URLs logged to console if email fails
✅ Debug dashboard available at `/auth/debug`
✅ Test users can be created with scripts

### Production Mode (NODE_ENV=production)

🔐 Email verification is required to login
🔐 Debug endpoints disabled
🔐 Email failures return generic messages
🔐 Secure credentials required

---

## Database Schema

### User Model

```
- id: string (unique)
- email: string (unique)
- name: string
- hashedPassword: string (bcrypt)
- emailVerified: DateTime (null if not verified)
- role: string (student, instructor, admin)
- createdAt: DateTime
- updatedAt: DateTime
```

### EmailVerificationToken Model

```
- id: string (unique)
- userId: string (foreign key)
- token: string (hashed, unique)
- expiresAt: DateTime (24 hours from creation)
- createdAt: DateTime
```

### PasswordReset Model

```
- id: string (unique)
- userId: string (foreign key)
- token: string (unique)
- expiresAt: DateTime (1 hour from creation)
- createdAt: DateTime
```

---

## Testing Flows

### Test Complete Signup → Email Verification → Login

1. Go to `/auth/signup`
2. Create account with test email
3. Check console for verification URL (in dev mode)
4. Click link to verify
5. Go to `/auth/signin`
6. Login with credentials

### Test Password Reset

1. Go to `/auth/forgot-password`
2. Enter your test email
3. Check console for reset URL (in dev mode)
4. Click link to reset
5. Enter new password
6. Go to `/auth/signin`
7. Login with new password

---

## Useful Commands

### Create Test User

```bash
node create-test-user-dev.js
```

### View Database Info

```bash
node create-test-user.js  # (if available)
```

### Check Prisma Database

```bash
npx prisma studio
```

### Reset Database

```bash
rm dev.db
npm run prisma:migrate
npm run seed
```

### View API Logs

```bash
# Watch terminal while testing
# NextAuth logs auth events
# Email errors are logged
# Authorization errors are logged
```

---

## API Endpoints

### Authentication

| Endpoint                         | Method | Purpose                    |
| -------------------------------- | ------ | -------------------------- |
| `/api/auth/signin`               | GET    | NextAuth signin page       |
| `/api/auth/callback/credentials` | POST   | Credentials authentication |
| `/api/auth/signup`               | POST   | Create new account         |
| `/api/auth/verify-email`         | GET    | Verify email with token    |
| `/api/auth/resend-verification`  | POST   | Resend verification email  |
| `/api/auth/request-reset`        | POST   | Request password reset     |
| `/api/auth/reset`                | POST   | Reset password with token  |

### Debug (Development Only)

| Endpoint          | Method | Purpose               |
| ----------------- | ------ | --------------------- |
| `/api/auth/debug` | GET    | View users and tokens |

### Frontend Pages

| Page                             | Purpose                    |
| -------------------------------- | -------------------------- |
| `/auth/signin`                   | User login                 |
| `/auth/signup`                   | Create account             |
| `/auth/forgot-password`          | Request password reset     |
| `/auth/reset-password?token=...` | Reset password             |
| `/auth/email-verified`           | Email verification success |
| `/auth/debug`                    | Debug dashboard (dev only) |

---

## Security Features

✅ Passwords hashed with bcrypt (10 rounds)
✅ Tokens hashed with SHA-256
✅ Tokens are cryptographically random (32 bytes)
✅ Tokens expire (24h email, 1h reset)
✅ Tokens deleted after use
✅ No plain-text passwords stored
✅ NEXTAUTH_SECRET required
✅ Email verification required in production

---

## Need Help?

1. **Check terminal output** - Most errors are logged
2. **Visit debug dashboard** - `/auth/debug`
3. **Check `.env.local`** - Verify configuration
4. **Check console in DevTools** - Look for network errors
5. **Re-create test user** - `node create-test-user-dev.js`

---

**Last Updated:** January 15, 2026
