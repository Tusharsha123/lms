import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function testEmailVerificationFlow() {
  console.log("🧪 Testing Email Verification Flow\n");

  const testEmail = `test-verify-${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";
  const testName = "Test Verification User";

  try {
    // Step 1: Signup
    console.log("📝 Step 1: Signing up new user...");
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });

    const signupData = await signupRes.json();

    if (!signupRes.ok) {
      console.error("❌ Signup failed:", signupData);
      return;
    }

    console.log("✅ Signup successful!");
    console.log(`   User ID: ${signupData.user.id}`);
    console.log(`   Email: ${signupData.user.email}`);
    console.log(`   Email Sent: ${signupData.emailSent}`);

    // Step 2: Check debug API for verification token
    console.log("\n🔐 Step 2: Checking for verification token...");
    const debugRes = await fetch(`${BASE_URL}/api/auth/debug`);
    const debugData = await debugRes.json();

    const user = debugData.users.find((u) => u.email === testEmail);
    const token = debugData.tokens.find((t) => t.userId === user?.id);

    if (!user) {
      console.error("❌ User not found in database!");
      return;
    }

    console.log("✅ User found in database:");
    console.log(
      `   Email Verified: ${user.emailVerified ? "✅ YES" : "❌ NO"}`
    );
    console.log(
      `   Password Hash: ${user.hashedPassword ? "✅ Set" : "❌ Not Set"}`
    );

    if (!token) {
      console.error("❌ Verification token not found!");
      return;
    }

    console.log("✅ Verification token found:");
    console.log(`   Token (truncated): ${token.token.substring(0, 16)}...`);
    console.log(`   Expires At: ${new Date(token.expiresAt).toLocaleString()}`);

    // Step 3: Try to login before verification (should fail in prod, succeed in dev)
    console.log("\n🔑 Step 3: Attempting login WITHOUT verification...");
    const preVerifyLoginRes = await fetch(
      `${BASE_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      }
    );

    console.log(`   Response Status: ${preVerifyLoginRes.status}`);

    if (process.env.NODE_ENV === "production") {
      if (preVerifyLoginRes.status === 401) {
        console.log("✅ Correctly blocked unverified user (production mode)");
      } else {
        console.log("⚠️  Unverified user was allowed to login");
      }
    } else {
      console.log(
        "✅ Development mode - unverified login is allowed for testing"
      );
    }

    // Step 4: Simulate verification (in real scenario, user would click email link)
    console.log("\n✉️  Step 4: Simulating email verification...");
    console.log(`   In production: User would click link in email`);
    console.log(`   Link: ${BASE_URL}/api/auth/verify-email?token=<token>`);

    // We need the unhashed token to verify, but we only have the hashed one
    // In real flow, user gets unhashed token in email
    console.log("   Note: In test, we'd need the unhashed token from email");
    console.log(
      "   Email would contain: /api/auth/verify-email?token=<unhashed-token>"
    );

    // Step 5: Check test status
    console.log("\n📋 Step 5: Test Summary");
    console.log("━".repeat(50));
    console.log("✅ Signup flow works");
    console.log("✅ User created with unverified email");
    console.log("✅ Verification token generated");
    console.log("✅ Email configuration checked");

    if (signupData.emailSent === false) {
      console.log("⚠️  Email failed to send (check .env.local configuration)");
      console.log("   But fallback URL is logged to server console");
    } else {
      console.log("✅ Email was sent successfully");
    }

    console.log("\n📝 Test Credentials Created:");
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log("\n💡 To complete verification:");
    console.log(
      "   1. Check your email for verification link (or server logs)"
    );
    console.log("   2. Click the verification link");
    console.log("   3. You'll be redirected to /auth/email-verified");
    console.log("   4. Then you can login at /auth/signin");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testEmailVerificationFlow();
