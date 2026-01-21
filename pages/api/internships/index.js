import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { 
        search, 
        locationType, 
        type, 
        status = "ACTIVE",
        company,
        skills,
        limit = 20,
        offset = 0
      } = req.query;

      const where = {
        status,
      };

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (locationType) {
        where.locationType = locationType;
      }

      if (type) {
        where.type = type;
      }

      if (company) {
        where.company = {
          name: { contains: company }
        };
      }

      if (skills) {
        // Skills are stored as JSON string, need to filter in-memory for simplicity
        // In production, consider using a full-text search solution
      }

      const internships = await prisma.internship.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              verified: true,
              location: true,
              industry: true,
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      // Parse skills JSON for each internship
      const internshipsWithSkills = internships.map(internship => ({
        ...internship,
        skills: internship.skills ? JSON.parse(internship.skills) : [],
        applicationCount: internship._count.applications,
      }));

      return res.status(200).json(internshipsWithSkills);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || (session.user.role !== "admin" && session.user.role !== "instructor")) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        companyId,
        title,
        description,
        requirements,
        responsibilities,
        location,
        locationType = "ONSITE",
        type = "FULL_TIME",
        duration,
        stipend,
        skills = [],
        deadline,
        startDate,
      } = req.body;

      if (!companyId || !title || !description || !requirements || !responsibilities || !location) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const internship = await prisma.internship.create({
        data: {
          companyId,
          title,
          description,
          requirements,
          responsibilities,
          location,
          locationType,
          type,
          duration,
          stipend,
          skills: JSON.stringify(skills),
          status: "ACTIVE",
          deadline: deadline ? new Date(deadline) : null,
          startDate: startDate ? new Date(startDate) : null,
          postedBy: session.user.id,
        },
        include: {
          company: true,
        }
      });

      return res.status(201).json({
        ...internship,
        skills: JSON.parse(internship.skills),
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Internships API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
