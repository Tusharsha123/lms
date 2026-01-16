import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    if (req.method === "GET") {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });
      // Parse skills string into array for frontend
      const parsed = {
        ...profile,
        skills: profile?.skills
          ? profile.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      return res.status(200).json(parsed);
    }

    if (req.method === "PUT") {
      const { bio, location, skills } = req.body;
      // Accept skills array or comma string
      const skillsString = Array.isArray(skills)
        ? skills.join(",")
        : skills || "";

      const profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          bio,
          location,
          skills: skillsString,
        },
      });

      // Return parsed skills
      const parsed = {
        ...profile,
        skills: profile.skills
          ? profile.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      return res.status(200).json(parsed);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
