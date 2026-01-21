import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const internship = await prisma.internship.findUnique({
        where: { id },
        include: {
          company: true,
          _count: {
            select: { applications: true }
          }
        },
      });

      if (!internship) {
        return res.status(404).json({ error: "Internship not found" });
      }

      // Increment view count
      await prisma.internship.update({
        where: { id },
        data: { views: { increment: 1 } }
      });

      return res.status(200).json({
        ...internship,
        skills: internship.skills ? JSON.parse(internship.skills) : [],
        applicationCount: internship._count.applications,
      });
    }

    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || (session.user.role !== "admin" && session.user.role !== "instructor")) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        title,
        description,
        requirements,
        responsibilities,
        location,
        locationType,
        type,
        duration,
        stipend,
        skills,
        status,
        deadline,
        startDate,
      } = req.body;

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (requirements) updateData.requirements = requirements;
      if (responsibilities) updateData.responsibilities = responsibilities;
      if (location) updateData.location = location;
      if (locationType) updateData.locationType = locationType;
      if (type) updateData.type = type;
      if (duration !== undefined) updateData.duration = duration;
      if (stipend !== undefined) updateData.stipend = stipend;
      if (skills) updateData.skills = JSON.stringify(skills);
      if (status) updateData.status = status;
      if (deadline) updateData.deadline = new Date(deadline);
      if (startDate) updateData.startDate = new Date(startDate);

      const internship = await prisma.internship.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
        }
      });

      return res.status(200).json({
        ...internship,
        skills: internship.skills ? JSON.parse(internship.skills) : [],
      });
    }

    if (req.method === "DELETE") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized - admin only" });
      }

      await prisma.internship.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Internship deleted successfully" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Internship API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
