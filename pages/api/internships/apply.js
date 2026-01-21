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

    const { internshipId, coverLetter, resumeId } = req.body;

    if (!internshipId || !coverLetter) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if internship exists and is active
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    if (internship.status !== "ACTIVE") {
      return res.status(400).json({ error: "This internship is no longer accepting applications" });
    }

    // Check if user already applied
    const existingApplication = await prisma.internshipApplication.findUnique({
      where: {
        userId_internshipId: {
          userId: session.user.id,
          internshipId,
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied to this internship" });
    }

    // Verify resume if provided
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id,
        }
      });

      if (!resume) {
        return res.status(400).json({ error: "Invalid resume ID" });
      }
    }

    // Create application
    const application = await prisma.internshipApplication.create({
      data: {
        userId: session.user.id,
        internshipId,
        resumeId,
        coverLetter,
        status: "PENDING",
      },
      include: {
        internship: {
          include: {
            company: true,
          }
        },
        resume: true,
      }
    });

    // TODO: Send notification email to company/admin
    // This should be implemented using the email service configured in .env
    // Example: await sendEmail({
    //   to: internship.company.email,
    //   subject: 'New Application Received',
    //   body: `New application from ${session.user.name} for ${internship.title}`
    // });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply API error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
}
