import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    if (req.method === "GET") {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            include: { instructor: { select: { name: true } } },
          },
        },
      });

      return res.status(200).json(enrollments);
    }

    if (req.method === "POST") {
      const { courseId } = req.body;

      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      if (existing) {
        return res.status(400).json({ error: "Already enrolled" });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
        },
      });

      return res.status(201).json(enrollment);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
