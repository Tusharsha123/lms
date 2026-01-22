import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { category, difficulty, tags, limit = 20, offset = 0 } = req.query;

      const where = {
        isPublished: true,
      };

      if (category) {
        where.category = category;
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      // Tags filtering would need to be done client-side for SQLite
      const tests = await prisma.mockTest.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          duration: true,
          totalQuestions: true,
          passingScore: true,
          tags: true,
          createdAt: true,
          _count: {
            select: { attempts: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      // Parse tags JSON
      const testsWithTags = tests.map(test => ({
        ...test,
        tags: test.tags ? JSON.parse(test.tags) : [],
        attemptCount: test._count.attempts,
      }));

      return res.status(200).json(testsWithTags);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || (session.user.role !== "admin" && session.user.role !== "instructor")) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        title,
        description,
        category = "TECHNICAL",
        difficulty = "INTERMEDIATE",
        duration,
        totalQuestions,
        passingScore = 70,
        questions = [],
        tags = [],
        isPublished = false,
      } = req.body;

      if (!title || !description || !duration || !totalQuestions || !questions.length) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const test = await prisma.mockTest.create({
        data: {
          title,
          description,
          category,
          difficulty,
          duration: parseInt(duration),
          totalQuestions: parseInt(totalQuestions),
          passingScore: parseInt(passingScore),
          questions: JSON.stringify(questions),
          tags: JSON.stringify(tags),
          isPublished,
          createdBy: session.user.id,
        }
      });

      return res.status(201).json({
        ...test,
        questions: JSON.parse(test.questions),
        tags: JSON.parse(test.tags),
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Mock tests API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
