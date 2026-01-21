import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.method === "GET") {
      const learningPaths = await prisma.learningPath.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: [
          { isActive: 'desc' },
          { createdAt: 'desc' }
        ],
      });

      const pathsWithDetails = learningPaths.map(path => ({
        ...path,
        goals: path.goals ? JSON.parse(path.goals) : [],
        courseIds: path.courseIds ? JSON.parse(path.courseIds) : [],
      }));

      return res.status(200).json(pathsWithDetails);
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        goals = [],
        courseIds = [],
        recommendedBy = "AI",
      } = req.body;

      if (!title || !description || courseIds.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const learningPath = await prisma.learningPath.create({
        data: {
          userId: session.user.id,
          title,
          description,
          goals: JSON.stringify(goals),
          courseIds: JSON.stringify(courseIds),
          recommendedBy,
          isActive: true,
          progress: 0,
        }
      });

      return res.status(201).json({
        ...learningPath,
        goals: JSON.parse(learningPath.goals),
        courseIds: JSON.parse(learningPath.courseIds),
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Learning path API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
