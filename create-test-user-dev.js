import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Delete existing test user if it exists
    await prisma.user.deleteMany({
      where: { email: "test@example.com" },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create new test user with verified email
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        hashedPassword,
        emailVerified: new Date(), // Mark as verified for testing
        role: "student",
      },
    });

    console.log("✅ Test user created successfully:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    console.log(`   Role: ${user.role}`);
    console.log("\n📝 Test Credentials:");
    console.log(`   Email: test@example.com`);
    console.log(`   Password: password123`);
    console.log("\n🔗 Try logging in at http://localhost:3000/auth/signin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
    process.exit(1);
  }
}

createTestUser();
