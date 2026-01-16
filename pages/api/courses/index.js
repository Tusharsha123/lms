import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      const isInstructor =
        session?.user?.role === "instructor" || session?.user?.role === "admin";

      let courses = await prisma.course.findMany({
        where: isInstructor ? {} : { isPublished: true },
        include: {
          instructor: { select: { name: true } },
          lessons: { select: { id: true } },
        },
      });

      if (courses.length === 0) {
        // Return mock data if no courses are found
        courses = [
          {
            id: "1",
            title: "Intro to JavaScript",
            description: "Learn JS basics",
            level: "beginner",
            category: "web",
            instructor: { name: "Instructor One" },
            isPublished: true,
            price: 0,
            duration: 5,
            lessons: [],
          },
          {
            id: "2",
            title: "React for Beginners",
            description: "Build UIs with React",
            level: "beginner",
            category: "web",
            instructor: { name: "Instructor One" },
            isPublished: true,
            price: 0,
            duration: 8,
            lessons: [],
          },
        ];
      }

      const coursesWithCount = courses.map((course) => ({
        ...course,
        students: Math.floor(Math.random() * 500),
      }));

      return res.status(200).json(coursesWithCount);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const { title, description, level, category, duration, price } = req.body;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          level,
          category,
          duration: duration ? parseInt(duration) : null,
          price: parseFloat(price) || 0,
          instructorId: session.user.id,
          isPublished: false,
        },
      });

      return res.status(201).json(course);
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Courses error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
