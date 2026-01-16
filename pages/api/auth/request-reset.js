import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../../lib/email";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Don't reveal whether email exists (security best practice)
    if (!user)
      return res.status(200).json({
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });

    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user, token);
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        `⚠️  Password reset email failed for ${user.email}:`,
        emailError.message
      );

      // In development, log the reset URL as fallback
      if (process.env.NODE_ENV !== "production") {
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
        console.log(`\n🔗 FALLBACK RESET URL (email failed): ${resetUrl}\n`);
      }
    }

    return res.status(200).json({
      message:
        "If an account exists for this email, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Request reset error:", err);
    res.status(500).json({ error: "Failed to request password reset" });
  }
}
