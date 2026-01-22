import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { status, limit = 20, offset = 0 } = req.query;

    const where = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const applications = await prisma.internshipApplication.findMany({
      where,
      include: {
        internship: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                verified: true,
              }
            }
          }
        },
        resume: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Parse skills for each internship
    const applicationsWithSkills = applications.map(app => ({
      ...app,
      internship: {
        ...app.internship,
        skills: app.internship.skills ? JSON.parse(app.internship.skills) : [],
      }
    }));

    return res.status(200).json(applicationsWithSkills);
  } catch (error) {
    console.error("Applications API error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
}
