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
      const { upcoming, completed, limit = 20, offset = 0 } = req.query;

      const where = {
        userId: session.user.id,
      };

      if (upcoming === 'true') {
        where.completed = false;
        where.scheduledFor = {
          gte: new Date(),
        };
      } else if (completed === 'true') {
        where.completed = true;
      }

      const schedules = await prisma.studySchedule.findMany({
        where,
        orderBy: { scheduledFor: upcoming === 'true' ? 'asc' : 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return res.status(200).json(schedules);
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        courseId,
        taskType = "STUDY",
        scheduledFor,
        duration,
        priority = "MEDIUM",
      } = req.body;

      if (!title || !scheduledFor || !duration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const schedule = await prisma.studySchedule.create({
        data: {
          userId: session.user.id,
          title,
          description,
          courseId,
          taskType,
          scheduledFor: new Date(scheduledFor),
          duration: parseInt(duration),
          priority,
          completed: false,
        }
      });

      return res.status(201).json(schedule);
    }

    if (req.method === "PUT") {
      const { id, completed } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Schedule ID is required" });
      }

      // Verify ownership
      const existingSchedule = await prisma.studySchedule.findUnique({
        where: { id },
      });

      if (!existingSchedule || existingSchedule.userId !== session.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updateData = {};
      if (completed !== undefined) {
        updateData.completed = completed;
        if (completed) {
          updateData.completedAt = new Date();
        }
      }

      const schedule = await prisma.studySchedule.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json(schedule);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Schedule API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
