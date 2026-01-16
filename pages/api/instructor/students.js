import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { courseId, limit = 50, offset = 0 } = req.query;

    const where = { course: { instructorId: session.user.id } };
    if (courseId) where.courseId = courseId;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
          course: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.enrollment.count({ where }),
    ]);

    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: enrollment.userId,
            lesson: { courseId: enrollment.courseId },
            completed: true,
          },
        });

        const totalLessons = await prisma.lesson.count({
          where: { courseId: enrollment.courseId },
        });

        return {
          ...enrollment,
          completedLessons,
          totalLessons,
          progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        };
      })
    );

    res.json({ students: studentsWithProgress, total });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
}
