import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createRealUser(email, password, name) {
  try {
    console.log(`🧪 Creating verified user: ${email}\n`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ User already exists!");
      return;
    }

    // Create the user with verified email
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        emailVerified: new Date(), // Already verified for development
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

// Usage: node create-user.js your@email.com yourpassword "Your Name"
const [, , email, password, name] = process.argv;

if (!email || !password || !name) {
  console.log("❌ Usage: node create-user.js <email> <password> <name>");
  console.log(
    '📝 Example: node create-user.js user@example.com mypassword123 "John Doe"'
  );
  process.exit(1);
}

createRealUser(email, password, name);
