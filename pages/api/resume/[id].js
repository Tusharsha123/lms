import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);

      const resume = await prisma.resume.findUnique({
        where: { id },
        include: {
          template: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      });

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      // Check visibility
      if (resume.visibility === "PRIVATE" && (!session || resume.userId !== session.user.id)) {
        return res.status(403).json({ error: "Not authorized" });
      }

      return res.status(200).json({
        ...resume,
        content: JSON.parse(resume.content),
      });
    }

    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Verify ownership
      const existingResume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!existingResume || existingResume.userId !== session.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const {
        title,
        content,
        visibility,
        isPrimary,
      } = req.body;

      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = JSON.stringify(content);
      if (visibility) updateData.visibility = visibility;
      
      // If setting as primary, unset other primary resumes
      if (isPrimary) {
        await prisma.resume.updateMany({
          where: {
            userId: session.user.id,
            isPrimary: true,
            id: { not: id },
          },
          data: {
            isPrimary: false,
          }
        });
        updateData.isPrimary = true;
      } else if (isPrimary === false) {
        updateData.isPrimary = false;
      }

      const resume = await prisma.resume.update({
        where: { id },
        data: updateData,
        include: {
          template: true,
        }
      });

      return res.status(200).json({
        ...resume,
        content: JSON.parse(resume.content),
      });
    }

    if (req.method === "DELETE") {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Verify ownership
      const existingResume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!existingResume || existingResume.userId !== session.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await prisma.resume.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Resume deleted successfully" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Resume API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
