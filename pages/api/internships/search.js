import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      query = "",
      locationType,
      type,
      status = "ACTIVE",
      skills,
      minStipend,
      company,
      sort = "recent", // recent, views, applications
      limit = 20,
      offset = 0
    } = req.query;

    const where = {
      status,
    };

    // Full-text search across multiple fields
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { requirements: { contains: query } },
        { location: { contains: query } },
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

    let orderBy = {};
    switch (sort) {
      case 'views':
        orderBy = { views: 'desc' };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
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
            size: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy,
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Parse skills and apply client-side filters
    let results = internships.map(internship => ({
      ...internship,
      skills: internship.skills ? JSON.parse(internship.skills) : [],
      applicationCount: internship._count.applications,
    }));

    // Filter by skills if provided (client-side for SQLite compatibility)
    if (skills) {
      const searchSkills = skills.toLowerCase().split(',').map(s => s.trim());
      results = results.filter(internship =>
        searchSkills.some(skill =>
          internship.skills.some(s => s.toLowerCase().includes(skill))
        )
      );
    }

    // Filter by minimum stipend if provided
    if (minStipend && minStipend !== "0") {
      const minAmount = parseInt(minStipend);
      results = results.filter(internship => {
        if (!internship.stipend) return false;
        const match = internship.stipend.match(/\d+/);
        if (!match) return false;
        return parseInt(match[0]) >= minAmount;
      });
    }

    const total = results.length;

    return res.status(200).json({
      internships: results,
      total,
      hasMore: total === parseInt(limit),
    });
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ error: "Failed to search internships" });
  }
}
