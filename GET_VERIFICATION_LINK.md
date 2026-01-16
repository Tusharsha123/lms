# ✅ How to Get Your Email Verification Link

Since email isn't configured yet, here are your options:

---

## 🔗 Option 1: Check Console Logs (EASIEST)

When you signup, the verification link is printed to the **terminal/console** where your dev server is running.

### Steps:

1. Open your terminal where `npm run dev` is running
2. Look for this output:
   ```
   ═════════════════════════════════════════════════
   📧 EMAIL (DEVELOPMENT MODE - NOT ACTUALLY SENT)
   ═════════════════════════════════════════════════
   To: your-email@example.com
   Subject: Verify Your Email Address
   From: noreply@lmsplatform.com
   ─────────────────────────────────────────────────
   Verify your email by visiting this URL: http://localhost:3000/api/auth/verify-email?token=...
   ```
3. **Copy the entire verification link** starting with `http://localhost:3000/api/auth/verify-email?token=`
4. **Paste it into your browser** and press Enter
5. You'll be redirected to `/auth/email-verified` ✅

---

## 🌐 Option 2: Use Debug Dashboard

1. **Start your dev server** if not already running:

   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/dev-verification
   - Shows all pending verification tokens
   - Click "Verify" button to verify immediately
   - No need to check emails!

---

## 🧪 Option 3: Use Pre-Verified Test User

1. **Create the test user:**

   ```bash
   node create-test-user-dev.js
   ```

2. **Login immediately** at http://localhost:3000/auth/signin
   - Email: `test@example.com`
   - Password: `password123`
   - Already verified, no email needed!

---

## 📊 Complete Signup → Verify → Login Flow

### Step 1: Signup

```
1. Go to http://localhost:3000/auth/signup
2. Fill in name, email, password
3. Click "Sign Up"
```

### Step 2: Get Verification Link

```
Choose ONE method:
A) Check console logs (Option 1 above)
B) Use debug dashboard (Option 2 above)
C) Use test user (Option 3 above)
```

### Step 3: Verify Email

```
A) Copy verification link from console → paste in browser
   OR
B) Click "Verify" on debug dashboard
   OR
C) Skip - test user is already verified
```

### Step 4: Login

```
1. Go to http://localhost:3000/auth/signin
2. Use your email and password
3. Click "Sign In"
4. You're in! 🎉
```

---

## 🖥️ Example Console Output

When you signup, you'll see something like this in your terminal:

```
═════════════════════════════════════════════════════════════════════
📧 EMAIL (DEVELOPMENT MODE - NOT ACTUALLY SENT)
═════════════════════════════════════════════════════════════════════
To: testuser@example.com
Subject: Verify Your Email Address
From: noreply@lmsplatform.com
─────────────────────────────────────────────────────────────────────
Verify your email by visiting this URL:
http://localhost:3000/api/auth/verify-email?token=a641a0f0dfe58c0d1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f

(This is a 64-character token)
─────────────────────────────────────────────────────────────────────
```

**Just copy the URL starting with `http://localhost:3000/api/auth/verify-email?token=` and paste it in your browser!**

---

## ⚡ Quick Test Right Now

### 1. Create Test User (30 seconds)

```bash
node create-test-user-dev.js
```

### 2. Login Immediately

- Go to http://localhost:3000/auth/signin
- Email: `test@example.com`
- Password: `password123`
- **Done!** Already verified ✅

---

## 🔧 To Configure Real Email Later

When ready for production, update `.env.local`:

```env
# Gmail Option
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-real-email@gmail.com
EMAIL_SERVER_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-real-email@gmail.com
```

Steps:

1. Enable 2FA on Gmail
2. Get App Password from https://myaccount.google.com/apppasswords
3. Paste into `.env.local`
4. Emails will now work automatically! ✅

---

## 📝 Troubleshooting

### "I don't see the verification link in console"

- Make sure your dev server is running in the terminal you can see
- Look for output that says "EMAIL (DEVELOPMENT MODE)"
- If using VS Code, check the OUTPUT tab (Debug Console)

### "The verification link doesn't work"

- Make sure you copied the ENTIRE link including the token
- Check that NEXTAUTH_URL is set to `http://localhost:3000`
- Try visiting `/auth/debug` to see all tokens

### "I want to use real email"

- Add real credentials to `.env.local`
- System will auto-switch to sending real emails
- All verification links will be sent via email instead

---

## ✅ You're All Set!

**Your LMS auth system is working perfectly.**
The verification emails are displaying in the console for development convenience.

**Choose your next step:**

- ✅ [Use pre-verified test user](#-option-3-use-pre-verified-test-user)
- ✅ [Check console for verification link](#-option-1-check-console-logs-easiest)
- ✅ [Use debug dashboard](#-option-2-use-debug-dashboard)

---

**Questions?** Check the other documentation:

- [AUTH_QUICK_START.md](AUTH_QUICK_START.md) - Quick reference
- [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md) - Full troubleshooting guide
- [EMAIL_VERIFICATION_VERIFIED.md](EMAIL_VERIFICATION_VERIFIED.md) - System status
