import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const attempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: {
        test: {
          select: {
            title: true,
            description: true,
            category: true,
            difficulty: true,
            totalQuestions: true,
            passingScore: true,
          }
        },
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: "Test attempt not found" });
    }

    // Check ownership
    if (attempt.userId !== session.user.id && session.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    return res.status(200).json({
      ...attempt,
      answers: JSON.parse(attempt.answers),
      feedback: attempt.feedback ? JSON.parse(attempt.feedback) : null,
    });
  } catch (error) {
    console.error("Test results API error:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
}
