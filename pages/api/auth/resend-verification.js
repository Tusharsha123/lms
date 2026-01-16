import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../lib/email";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message:
          "If the email exists and is not verified, a new verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Delete any existing verification tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new verification token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    try {
      await sendVerificationEmail(user, token);
      console.log(`✅ Verification email resent to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // In development, log the URL as fallback
      if (process.env.NODE_ENV !== "production") {
        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
        console.log(
          `\n🔗 FALLBACK VERIFICATION URL (email failed): ${verificationUrl}\n`
        );
      }
      throw new Error("Failed to send verification email. Please try again.");
    }

    // In development, also log the verification URL for convenience
    if (process.env.NODE_ENV !== "production") {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
      console.log(`\n🔗 RESEND VERIFICATION URL: ${verificationUrl}\n`);
      console.log(`📧 Email resent to ${user.email}. Check your inbox!\n`);
    }

    res.status(200).json({
      message: "Verification email sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
}
