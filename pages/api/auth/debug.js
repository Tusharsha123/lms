import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow GET and in development
  if (req.method !== "GET" || process.env.NODE_ENV === "production") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        hashedPassword: true,
        createdAt: true,
      },
    });

    // Get email verification tokens
    const tokens = await prisma.emailVerificationToken.findMany({
      select: {
        id: true,
        userId: true,
        token: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      users,
      tokens,
      timestamp: new Date(),
      note: "This endpoint is only available in development mode",
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Failed to fetch debug info" });
  }
}
