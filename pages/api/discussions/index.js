import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { courseId, lessonId, limit = 20, offset = 0 } = req.query;

      const where = {};
      if (courseId) where.courseId = courseId;
      if (lessonId) where.lessonId = lessonId;

      const [discussions, total] = await Promise.all([
        prisma.discussion.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, image: true, role: true } },
            _count: { select: { replies: true } },
          },
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' },
          ],
          take: parseInt(limit),
          skip: parseInt(offset),
        }),
        prisma.discussion.count({ where }),
      ]);

      res.json({ discussions, total });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch discussions' });
    }
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { courseId, lessonId, title, content } = req.body;

      if (!courseId || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });

      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const course = await prisma.course.findUnique({ where: { id: courseId } });

      const isInstructor = course.instructorId === session.user.id;
      const isAdmin = user.role === 'admin';

      if (!enrollment && !isInstructor && !isAdmin) {
        return res.status(403).json({ error: 'Must be enrolled to discuss' });
      }

      const discussion = await prisma.discussion.create({
        data: {
          userId: session.user.id,
          courseId,
          lessonId: lessonId || null,
          title,
          content,
        },
        include: {
          user: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { replies: true } },
        },
      });

      res.status(201).json(discussion);
    } catch (error) {
      console.error('Create discussion error:', error);
      res.status(500).json({ error: 'Failed to create discussion' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
