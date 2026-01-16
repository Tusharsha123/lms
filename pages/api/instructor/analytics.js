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
    const { period = '30d' } = req.query;
    
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [enrollmentsByDay, revenueByDay, completionsByDay, reviewsByRating] = await Promise.all([
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as count 
        FROM Enrollment 
        WHERE courseId IN (SELECT id FROM Course WHERE instructorId = ${session.user.id})
        AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, SUM(amount) as total 
        FROM "Order" 
        WHERE courseId IN (SELECT id FROM Course WHERE instructorId = ${session.user.id})
        AND status = 'completed'
        AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
      prisma.$queryRaw`
        SELECT DATE(updatedAt) as date, COUNT(*) as count 
        FROM Enrollment 
        WHERE courseId IN (SELECT id FROM Course WHERE instructorId = ${session.user.id})
        AND status = 'completed'
        AND updatedAt >= ${startDate}
        GROUP BY DATE(updatedAt)
        ORDER BY date ASC
      `,
      prisma.review.groupBy({
        by: ['rating'],
        where: { course: { instructorId: session.user.id } },
        _count: true,
      }),
    ]);

    const coursePerformance = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      select: {
        id: true,
        title: true,
        _count: { select: { enrollments: true } },
        reviews: { select: { rating: true } },
        enrollments: {
          where: { status: 'completed' },
          select: { id: true },
        },
      },
    });

    const courseStats = coursePerformance.map(course => ({
      id: course.id,
      title: course.title,
      enrollments: course._count.enrollments,
      completions: course.enrollments.length,
      completionRate: course._count.enrollments > 0 
        ? Math.round((course.enrollments.length / course._count.enrollments) * 100) 
        : 0,
      avgRating: course.reviews.length > 0
        ? Math.round((course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length) * 10) / 10
        : 0,
    }));

    res.json({
      enrollmentsByDay,
      revenueByDay,
      completionsByDay,
      reviewsByRating: reviewsByRating.map(r => ({ rating: r.rating, count: r._count })),
      courseStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
