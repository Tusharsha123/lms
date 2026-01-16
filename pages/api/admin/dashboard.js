import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    if (req.method === "GET") {
      // Get dashboard statistics
      const totalUsers = await prisma.user.count();
      const totalCourses = await prisma.course.count();
      const totalEnrollments = await prisma.enrollment.count();

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        stats: { totalUsers, totalCourses, totalEnrollments },
        recentUsers: users,
      });
    }

    if (req.method === "PUT") {
      const { userId, role } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      return res.status(200).json(user);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
