import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../lib/prisma';
import { notifyDiscussionReply } from '../../../../lib/notifications';

export default async function handler(req, res) {
  const { id: discussionId } = req.query;

  if (req.method === 'GET') {
    try {
      const replies = await prisma.discussionReply.findMany({
        where: { discussionId },
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
        },
        orderBy: { createdAt: 'asc' },
      });

      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch replies' });
    }
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content required' });
      }

      const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: { course: true },
      });

      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const isInstructor = discussion.course.instructorId === session.user.id;

      const reply = await prisma.discussionReply.create({
        data: {
          discussionId,
          userId: session.user.id,
          content,
          isInstructorReply: isInstructor,
        },
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
        },
      });

      if (discussion.userId !== session.user.id) {
        await notifyDiscussionReply(
          discussion.userId,
          discussion.title,
          discussion.courseId,
          discussionId
        );
      }

      res.status(201).json(reply);
    } catch (error) {
      console.error('Create reply error:', error);
      res.status(500).json({ error: 'Failed to create reply' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
