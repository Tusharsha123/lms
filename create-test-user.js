import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createTestUser(email, password, name, role = "student") {
  try {
    console.log(`🧪 Creating test user: ${email}\n`);

    // Clean up any existing user with this email
    await prisma.user.deleteMany({
      where: { email },
    });

    // Create the user with auto-verified email
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        emailVerified: new Date(), // Auto-verified for development
        role,
      },
    });

    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: "",
      },
    });

    console.log("✅ User created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log("✅ Email Status: VERIFIED (Development Mode)");
    console.log(
      "\n🚀 You can now sign in at http://localhost:3000/auth/signin"
    );
  } catch (error) {
    console.error("❌ Failed to create user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create a default test user
createTestUser("test@example.com", "password123", "Test User", "student");
