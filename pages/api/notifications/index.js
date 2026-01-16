import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  // 1. Prevent caching so we always get fresh data
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      // 2. Safely parse query parameters
      const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Cap at 100 for safety
      const offset = parseInt(req.query.offset) || 0;

      // 3. Fetch data in parallel for performance
      const [notifications, unreadCount, total] = await Promise.all([
        prisma.notification.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.notification.count({
          where: { userId: session.user.id, read: false },
        }),
        prisma.notification.count({
          where: { userId: session.user.id },
        }),
      ]);

      return res.status(200).json({ notifications, unreadCount, total });
    } catch (error) {
      console.error("API Error fetching notifications:", error);
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
