import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Notification ID is required" });
  }

  // Ensure the notification belongs to the current user before proceeding
  const notification = await prisma.notification.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  if (!notification) {
    return res.status(404).json({ error: "Notification not found or access denied" });
  }

  if (req.method === "PUT") {
    try {
      const updatedNotification = await prisma.notification.update({
        where: { id: id },
        data: { read: true },
      });
      return res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("API Error updating notification:", error);
      return res.status(500).json({ error: "Failed to update notification" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.notification.delete({
        where: { id: id },
      });
      return res.status(204).end(); // 204 No Content is standard for a successful delete
    } catch (error) {
      console.error("API Error deleting notification:", error);
      return res.status(500).json({ error: "Failed to delete notification" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}