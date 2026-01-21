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
      const { limit = 10 } = req.query;

      // Get user's existing recommendations
      let recommendations = await prisma.courseRecommendation.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  name: true,
                }
              }
            }
          }
        },
        orderBy: {
          score: 'desc',
        },
        take: parseInt(limit),
      });

      // If no recommendations exist, generate basic ones
      if (recommendations.length === 0) {
        // Get user's enrolled courses
        const enrollments = await prisma.enrollment.findMany({
          where: { userId: session.user.id },
          include: { course: true },
        });

        // Get all published courses not enrolled in
        const enrolledCourseIds = enrollments.map(e => e.courseId);
        const availableCourses = await prisma.course.findMany({
          where: {
            isPublished: true,
            id: { notIn: enrolledCourseIds },
          },
          include: {
            instructor: {
              select: { name: true },
            }
          },
          take: parseInt(limit),
        });

        // Create basic recommendations based on category matching
        const userCategories = [...new Set(enrollments.map(e => e.course.category))];
        
        for (const course of availableCourses) {
          const score = userCategories.includes(course.category) ? 0.8 : 0.5;
          const reason = userCategories.includes(course.category)
            ? `Based on your interest in ${course.category} courses`
            : "Popular course recommendation";

          await prisma.courseRecommendation.create({
            data: {
              userId: session.user.id,
              courseId: course.id,
              score,
              reason,
            }
          });
        }

        // Re-fetch recommendations
        recommendations = await prisma.courseRecommendation.findMany({
          where: { userId: session.user.id },
          include: {
            course: {
              include: {
                instructor: {
                  select: { name: true },
                }
              }
            }
          },
          orderBy: { score: 'desc' },
          take: parseInt(limit),
        });
      }

      return res.status(200).json(recommendations);
    }

    if (req.method === "POST") {
      // Generate new recommendations based on user activity
      const { forceRefresh = false } = req.body;

      if (forceRefresh) {
        // Delete existing recommendations
        await prisma.courseRecommendation.deleteMany({
          where: { userId: session.user.id },
        });
      }

      // Trigger recommendation generation
      // This would call the AI recommendation engine
      return res.status(200).json({ message: "Recommendations generated" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Recommendations API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
