import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../lib/email";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password with bcrypt and store
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without email verification
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        // emailVerified is left null - user must verify via email
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Store verification token with 24 hour expiry
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);
      console.log(
        `✅ User created and verification email sent: ${user.email} (ID: ${user.id})`
      );
    } catch (emailError) {
      console.error(
        `⚠️  User created but email failed: ${user.email}`,
        emailError.message
      );
      // Don't fail signup if email fails in production - user can resend
      if (process.env.NODE_ENV === "production") {
        return res.status(201).json({
          message:
            "Account created but verification email failed. Please check spam folder or request a new verification email.",
          user: { id: user.id, email: user.email },
          emailSent: false,
        });
      }
    }

    res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your address.",
      user: { id: user.id, email: user.email },
      emailSent: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
