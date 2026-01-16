import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    if (req.method === "GET") {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { submissions: { where: { userId: session.user.id } } },
      });

      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      return res.status(200).json(lesson);
    }

    if (req.method === "POST") {
      const { code } = req.body;

      const submission = await prisma.submission.create({
        data: {
          userId: session.user.id,
          lessonId: id,
          code,
          passed: false, // In production, run actual tests
        },
      });

      return res.status(201).json(submission);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Lesson error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
