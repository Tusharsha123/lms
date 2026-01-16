import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return res
      .status(403)
      .json({ error: "This endpoint is only available in development mode" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      // Get all unverified users and their verification tokens
      const unverifiedUsers = await prisma.user.findMany({
        where: {
          emailVerified: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          emailVerificationTokens: {
            select: {
              token: true,
              expiresAt: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1, // Get the latest token
          },
        },
      });

      // Format the response with verification URLs
      const usersWithTokens = unverifiedUsers.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        verificationToken: user.emailVerificationTokens[0]
          ? {
              hashedToken: user.emailVerificationTokens[0].token,
              expiresAt: user.emailVerificationTokens[0].expiresAt,
              createdAt: user.emailVerificationTokens[0].createdAt,
              // Note: We can't reverse the hash, but we can show this is for dev purposes
              note: "Token is hashed. Use the signup logs to get the plain token.",
            }
          : null,
      }));

      return res.status(200).json({
        message: "Development mode: Unverified users with tokens",
        users: usersWithTokens,
        note: "Check the server console logs after signup to see the verification URLs.",
      });
    } catch (error) {
      console.error("Error fetching verification tokens:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch verification tokens" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
