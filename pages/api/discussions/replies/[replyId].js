import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { replyId } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const reply = await prisma.discussionReply.findUnique({
    where: { id: replyId },
    include: { discussion: { include: { course: true } } },
  });

  if (!reply) {
    return res.status(404).json({ error: 'Reply not found' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isOwner = reply.userId === session.user.id;
  const isInstructor = reply.discussion.course.instructorId === session.user.id;
  const isAdmin = user.role === 'admin';

  if (req.method === 'PUT') {
    try {
      const { content, isAnswer } = req.body;

      const updateData = {};
      if (content !== undefined && isOwner) updateData.content = content;
      if (isAnswer !== undefined && (isInstructor || isAdmin)) updateData.isAnswer = isAnswer;

      const updated = await prisma.discussionReply.update({
        where: { id: replyId },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
        },
      });

      if (isAnswer) {
        await prisma.discussion.update({
          where: { id: reply.discussionId },
          data: { isResolved: true },
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reply' });
    }
  } else if (req.method === 'DELETE') {
    if (!isOwner && !isInstructor && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      await prisma.discussionReply.delete({ where: { id: replyId } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reply' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
