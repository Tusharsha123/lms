import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { category, premium } = req.query;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (premium !== undefined) {
      where.isPremium = premium === 'true';
    }

    const templates = await prisma.resumeTemplate.findMany({
      where,
      orderBy: [
        { popularity: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    const templatesWithStructure = templates.map(template => ({
      ...template,
      structure: JSON.parse(template.structure),
    }));

    return res.status(200).json(templatesWithStructure);
  } catch (error) {
    console.error("Templates API error:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
}
