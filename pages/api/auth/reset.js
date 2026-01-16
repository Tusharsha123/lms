import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { token, password, confirmPassword } = req.body;

  if (!token || !password)
    return res.status(400).json({ error: "Token and password are required" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });

  if (password !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  try {
    const record = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record)
      return res.status(400).json({ error: "Invalid or already used token" });

    if (new Date(record.expiresAt) < new Date()) {
      await prisma.passwordReset.delete({ where: { token } });
      return res
        .status(400)
        .json({
          error: "Token has expired. Please request a new password reset.",
        });
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 10);

    // Update user password and mark email as verified if not already
    await prisma.user.update({
      where: { id: record.userId },
      data: {
        hashedPassword: hashed,
        emailVerified: record.user.emailVerified || new Date(),
      },
    });

    // Delete the used token
    await prisma.passwordReset.delete({ where: { token } });

    console.log(`✅ Password reset successfully for ${record.user.email}`);

    return res.status(200).json({
      message:
        "Password updated successfully. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}
