import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const {
        title,
        description,
        content,
        courseId,
        codeTemplate,
        videoUrl,
        duration,
      } = req.body;

      // Verify user is instructor of this course
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (
        !course ||
        (course.instructorId !== session.user.id &&
          session.user.role !== "admin")
      ) {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Get the highest order number for this course
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: "desc" },
      });

      const lesson = await prisma.lesson.create({
        data: {
          title,
          description,
          content,
          courseId,
          codeTemplate,
          videoUrl,
          duration: duration ? parseInt(duration) : null,
          order: (lastLesson?.order || 0) + 1,
        },
      });

      return res.status(201).json(lesson);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Lessons error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
