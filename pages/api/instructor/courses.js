import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const courses = await prisma.course.findMany({
        where: { instructorId: session.user.id },
        include: {
          _count: { select: { enrollments: true, lessons: true } },
          reviews: { select: { rating: true } },
          lessons: { select: { id: true, title: true, order: true }, orderBy: { order: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const coursesWithStats = courses.map(course => {
        const avgRating = course.reviews.length > 0
          ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
          : 0;

        return {
          ...course,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: course.reviews.length,
          studentCount: course._count.enrollments,
          lessonCount: course._count.lessons,
        };
      });

      res.json(coursesWithStats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { courseId, ...updates } = req.body;

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || course.instructorId !== session.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updated = await prisma.course.update({
        where: { id: courseId },
        data: updates,
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { courseId } = req.body;

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || (course.instructorId !== session.user.id && user.role !== 'admin')) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await prisma.course.delete({ where: { id: courseId } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
