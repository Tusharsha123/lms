import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { workshopId } = req.body;

    if (!workshopId) {
      return res.status(400).json({ error: "Workshop ID is required" });
    }

    // Check if workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    if (workshop.status !== "SCHEDULED") {
      return res.status(400).json({ error: "This workshop is not accepting enrollments" });
    }

    // Check capacity
    if (workshop._count.enrollments >= workshop.capacity) {
      return res.status(400).json({ error: "Workshop is full" });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.workshopEnrollment.findUnique({
      where: {
        userId_workshopId: {
          userId: session.user.id,
          workshopId,
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "You are already enrolled in this workshop" });
    }

    // Create enrollment
    const enrollment = await prisma.workshopEnrollment.create({
      data: {
        userId: session.user.id,
        workshopId,
      },
      include: {
        workshop: true,
      }
    });

    return res.status(201).json({
      message: "Successfully enrolled in workshop",
      enrollment,
    });
  } catch (error) {
    console.error("Workshop enroll API error:", error);
    res.status(500).json({ error: "Failed to enroll in workshop" });
  }
}
