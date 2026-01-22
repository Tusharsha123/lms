import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { search, verified, industry, limit = 50, offset = 0 } = req.query;

      const where = {};

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (verified !== undefined) {
        where.verified = verified === 'true';
      }

      if (industry) {
        where.industry = industry;
      }

      const companies = await prisma.company.findMany({
        where,
        include: {
          _count: {
            select: { internships: true }
          }
        },
        orderBy: { name: 'asc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return res.status(200).json(companies);
    }

    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized - admin only" });
      }

      const {
        name,
        description,
        website,
        logo,
        location,
        industry,
        size,
      } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
      }

      const company = await prisma.company.create({
        data: {
          name,
          description,
          website,
          logo,
          location,
          industry,
          size,
          verified: false,
        }
      });

      return res.status(201).json(company);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Companies API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
