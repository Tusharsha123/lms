import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!verificationToken) {
      return res.status(400).json({ error: "Invalid or already used token" });
    }

    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return res.status(400).json({ error: "Token has expired" });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    console.log(`✅ Email verified for user: ${verificationToken.user.email}`);

    // Redirect to success page or signin page
    return res.redirect(
      302,
      "/auth/email-verified?email=" +
        encodeURIComponent(verificationToken.user.email)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
}
