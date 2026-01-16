import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
          course: { select: { id: true, title: true, instructorId: true } },
          lesson: { select: { id: true, title: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true, image: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }

      res.json(discussion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch discussion' });
    }
  } else if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: { course: true },
      });

      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const isOwner = discussion.userId === session.user.id;
      const isInstructor = discussion.course.instructorId === session.user.id;
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isInstructor && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { title, content, isPinned, isResolved } = req.body;

      const updateData = {};
      if (title !== undefined && isOwner) updateData.title = title;
      if (content !== undefined && isOwner) updateData.content = content;
      if (isPinned !== undefined && (isInstructor || isAdmin)) updateData.isPinned = isPinned;
      if (isResolved !== undefined) updateData.isResolved = isResolved;

      const updated = await prisma.discussion.update({
        where: { id },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
        },
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update discussion' });
    }
  } else if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: { course: true },
      });

      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const isOwner = discussion.userId === session.user.id;
      const isInstructor = discussion.course.instructorId === session.user.id;
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isInstructor && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await prisma.discussion.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete discussion' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
