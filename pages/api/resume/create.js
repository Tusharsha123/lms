import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
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

    const {
      templateId,
      title,
      content,
      visibility = "PRIVATE",
      isPrimary = false,
    } = req.body;

    if (!templateId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify template exists
    const template = await prisma.resumeTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // If setting as primary, unset other primary resumes
    if (isPrimary) {
      await prisma.resume.updateMany({
        where: {
          userId: session.user.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        }
      });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        templateId,
        title,
        content: JSON.stringify(content),
        visibility,
        isPrimary,
      },
      include: {
        template: true,
      }
    });

    return res.status(201).json({
      ...resume,
      content: JSON.parse(resume.content),
    });
  } catch (error) {
    console.error("Create resume API error:", error);
    res.status(500).json({ error: "Failed to create resume" });
  }
}
