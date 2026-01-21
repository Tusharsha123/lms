import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);

      const test = await prisma.mockTest.findUnique({
        where: { id },
        include: {
          _count: {
            select: { attempts: true }
          }
        }
      });

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Check if user has already attempted
      let userAttempt = null;
      if (session) {
        userAttempt = await prisma.testAttempt.findFirst({
          where: {
            userId: session.user.id,
            testId: id,
          },
          orderBy: { startedAt: 'desc' }
        });
      }

      return res.status(200).json({
        ...test,
        questions: JSON.parse(test.questions),
        tags: JSON.parse(test.tags),
        attemptCount: test._count.attempts,
        userAttempt: userAttempt ? {
          id: userAttempt.id,
          score: userAttempt.score,
          percentage: userAttempt.percentage,
          passed: userAttempt.passed,
          completedAt: userAttempt.completedAt,
        } : null,
      });
    }

    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || (session.user.role !== "admin" && session.user.role !== "instructor")) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        title,
        description,
        category,
        difficulty,
        duration,
        totalQuestions,
        passingScore,
        questions,
        tags,
        isPublished,
      } = req.body;

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (difficulty) updateData.difficulty = difficulty;
      if (duration) updateData.duration = parseInt(duration);
      if (totalQuestions) updateData.totalQuestions = parseInt(totalQuestions);
      if (passingScore) updateData.passingScore = parseInt(passingScore);
      if (questions) updateData.questions = JSON.stringify(questions);
      if (tags) updateData.tags = JSON.stringify(tags);
      if (isPublished !== undefined) updateData.isPublished = isPublished;

      const test = await prisma.mockTest.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json({
        ...test,
        questions: JSON.parse(test.questions),
        tags: JSON.parse(test.tags),
      });
    }

    if (req.method === "DELETE") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized - admin only" });
      }

      await prisma.mockTest.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Test deleted successfully" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Mock test API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
