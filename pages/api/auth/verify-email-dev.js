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

  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Only allow users to verify their own email or admins to verify any email
      if (session.user.role !== "admin" && session.user.email !== email) {
        return res
          .status(403)
          .json({ error: "You can only verify your own email" });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: "Email is already verified" });
      }

      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });

      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      return res.status(500).json({ error: "Failed to verify email" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
