import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.method === "GET") {
      const preferences = await prisma.userPreference.findUnique({
        where: { userId: session.user.id },
      });

      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      return res.status(200).json({
        ...preferences,
        careerGoals: preferences.careerGoals ? JSON.parse(preferences.careerGoals) : [],
        interests: preferences.interests ? JSON.parse(preferences.interests) : [],
        availability: preferences.availability ? JSON.parse(preferences.availability) : null,
        notificationPrefs: preferences.notificationPrefs ? JSON.parse(preferences.notificationPrefs) : null,
      });
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        learningStyle,
        careerGoals = [],
        interests = [],
        skillLevel,
        availability,
        preferredPace,
        notificationPrefs,
      } = req.body;

      const data = {};
      if (learningStyle) data.learningStyle = learningStyle;
      if (careerGoals) data.careerGoals = JSON.stringify(careerGoals);
      if (interests) data.interests = JSON.stringify(interests);
      if (skillLevel) data.skillLevel = skillLevel;
      if (availability) data.availability = JSON.stringify(availability);
      if (preferredPace) data.preferredPace = preferredPace;
      if (notificationPrefs) data.notificationPrefs = JSON.stringify(notificationPrefs);

      const preferences = await prisma.userPreference.upsert({
        where: { userId: session.user.id },
        update: data,
        create: {
          userId: session.user.id,
          ...data,
        }
      });

      return res.status(200).json({
        ...preferences,
        careerGoals: preferences.careerGoals ? JSON.parse(preferences.careerGoals) : [],
        interests: preferences.interests ? JSON.parse(preferences.interests) : [],
        availability: preferences.availability ? JSON.parse(preferences.availability) : null,
        notificationPrefs: preferences.notificationPrefs ? JSON.parse(preferences.notificationPrefs) : null,
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Preferences API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
