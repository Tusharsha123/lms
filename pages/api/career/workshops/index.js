import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { category, status, upcoming, limit = 20, offset = 0 } = req.query;

      const where = {};

      if (category) {
        where.category = category;
      }

      if (status) {
        where.status = status;
      } else if (upcoming === 'true') {
        where.status = "SCHEDULED";
        where.scheduledAt = {
          gte: new Date(),
        };
      }

      const workshops = await prisma.workshop.findMany({
        where,
        include: {
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { scheduledAt: 'asc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      const workshopsWithDetails = workshops.map(workshop => ({
        ...workshop,
        materials: workshop.materials ? JSON.parse(workshop.materials) : null,
        enrollmentCount: workshop._count.enrollments,
        availableSeats: workshop.capacity - workshop._count.enrollments,
      }));

      return res.status(200).json(workshopsWithDetails);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || (session.user.role !== "admin" && session.user.role !== "instructor")) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        title,
        description,
        instructor,
        instructorBio,
        category,
        duration,
        capacity,
        scheduledAt,
        meetingLink,
        materials,
      } = req.body;

      if (!title || !description || !instructor || !category || !duration || !capacity || !scheduledAt) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const workshop = await prisma.workshop.create({
        data: {
          title,
          description,
          instructor,
          instructorBio,
          category,
          duration: parseInt(duration),
          capacity: parseInt(capacity),
          scheduledAt: new Date(scheduledAt),
          meetingLink,
          materials: materials ? JSON.stringify(materials) : null,
          status: "SCHEDULED",
        }
      });

      return res.status(201).json({
        ...workshop,
        materials: workshop.materials ? JSON.parse(workshop.materials) : null,
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Workshops API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
