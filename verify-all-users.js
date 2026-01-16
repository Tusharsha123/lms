import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyAllUsers() {
  try {
    console.log("🔧 Verifying all unverified users...\n");

    const result = await prisma.user.updateMany({
      where: {
        emailVerified: null,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Verified ${result.count} users`);

    if (result.count > 0) {
      console.log("\n📧 All users can now sign in without email verification");
      console.log("🚀 Visit: http://localhost:3000/auth/signin");
    } else {
      console.log("\nℹ️  No unverified users found");
    }
  } catch (error) {
    console.error("❌ Failed to verify users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllUsers();
