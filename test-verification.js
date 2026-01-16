import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

async function testSignup() {
  try {
    console.log("🧪 Testing signup and email verification...\n");

    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: "test@example.com" },
    });

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        hashedPassword,
      },
    });

    console.log("✅ User created:", user.email);

    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: "",
      },
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    console.log("\n🔗 VERIFICATION URL:");
    console.log(verificationUrl);
    console.log("\n📋 Instructions:");
    console.log("1. Copy the URL above");
    console.log("2. Paste it in your browser");
    console.log(
      "3. Or visit http://localhost:3000/dev-verification to see all tokens"
    );
    console.log("4. Or use the manual verification on the sign-in page");

    console.log("\n🧪 Test credentials:");
    console.log("Email: test@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
