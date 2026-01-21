import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const resumes = await prisma.resume.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              category: true,
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: [
          { isPrimary: 'desc' },
          { updatedAt: 'desc' }
        ],
      });

      const resumesWithContent = resumes.map(resume => ({
        ...resume,
        content: JSON.parse(resume.content),
        applicationCount: resume._count.applications,
      }));

      return res.status(200).json(resumesWithContent);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Resumes API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
