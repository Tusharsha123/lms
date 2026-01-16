import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createVerifiedUser() {
  try {
    console.log("🧪 Creating a verified test user...\n");

    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: "test@example.com" },
    });

    // Create a test user with verified email
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        hashedPassword,
        emailVerified: new Date(), // Already verified!
      },
    });

    console.log("✅ Verified user created successfully!");
    console.log("📧 Email: test@example.com");
    console.log("🔑 Password: password123");
    console.log("✅ Email Status: VERIFIED");
    console.log(
      "\n🚀 You can now sign in at http://localhost:3000/auth/signin"
    );
  } catch (error) {
    console.error("❌ Failed to create user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createVerifiedUser();
