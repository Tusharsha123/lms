import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  try {
    if (req.method === "GET") {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          instructor: { select: { name: true, id: true } },
          lessons: { orderBy: { order: "asc" } },
          enrollments: { select: { userId: true } },
        },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json(course);
    }

    if (req.method === "PUT") {
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const course = await prisma.course.findUnique({ where: { id } });

      if (
        course.instructorId !== session.user.id &&
        session.user.role !== "admin"
      ) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await prisma.course.update({
        where: { id },
        data: req.body,
      });

      return res.status(200).json(updated);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Course error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
