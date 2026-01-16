import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

console.log("🔍 Checking Email Configuration...\n");

// Check environment variables
console.log("📋 Current Email Environment Variables:");
console.log(`EMAIL_SERVER_HOST: "${process.env.EMAIL_SERVER_HOST}"`);
console.log(`EMAIL_SERVER_PORT: "${process.env.EMAIL_SERVER_PORT}"`);
console.log(`EMAIL_SERVER_USER: "${process.env.EMAIL_SERVER_USER}"`);
console.log(
  `EMAIL_SERVER_PASSWORD: "${
    process.env.EMAIL_SERVER_PASSWORD ? "***SET***" : "NOT SET"
  }"`
);
console.log(`EMAIL_FROM: "${process.env.EMAIL_FROM}"`);
console.log(`NODE_ENV: "${process.env.NODE_ENV}"`);
console.log(`NEXTAUTH_URL: "${process.env.NEXTAUTH_URL}"\n`);

// Test configuration
if (
  !process.env.EMAIL_SERVER_HOST ||
  !process.env.EMAIL_SERVER_USER ||
  !process.env.EMAIL_SERVER_PASSWORD
) {
  console.log("❌ Missing required email configuration!");
  console.log(
    "Required: EMAIL_SERVER_HOST, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD"
  );
  process.exit(1);
}

console.log("✅ Email configuration looks good!");
console.log("\n📧 To test email delivery:");
console.log("1. Start the dev server: npm run dev");
console.log("2. Go to: http://localhost:3000/auth/signup");
console.log("3. Sign up with a real email address");
console.log("4. Check your email for verification link");
console.log("\n🎯 For production deployment:");
console.log("- Set NODE_ENV=production");
console.log("- Email verification will be required");
console.log("- Multiple users can register and verify emails");
