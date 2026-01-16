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
    const [
      courses,
      totalStudents,
      totalRevenue,
      reviews,
      recentEnrollments,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.course.findMany({
        where: { instructorId: session.user.id },
        include: {
          _count: { select: { enrollments: true, lessons: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.enrollment.count({
        where: { course: { instructorId: session.user.id } },
      }),
      prisma.order.aggregate({
        where: { course: { instructorId: session.user.id }, status: 'completed' },
        _sum: { amount: true },
      }),
      prisma.review.findMany({
        where: { course: { instructorId: session.user.id } },
        include: {
          user: { select: { name: true, image: true } },
          course: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.enrollment.findMany({
        where: { course: { instructorId: session.user.id } },
        include: {
          user: { select: { name: true, email: true, image: true } },
          course: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          course: { instructorId: session.user.id },
          status: 'completed',
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _sum: { amount: true },
      }),
    ]);

    const coursesWithStats = courses.map(course => ({
      ...course,
      avgRating: course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
        : 0,
      reviewCount: course.reviews.length,
      studentCount: course._count.enrollments,
      lessonCount: course._count.lessons,
    }));

    const avgRating = coursesWithStats.length > 0
      ? coursesWithStats.reduce((sum, c) => sum + c.avgRating, 0) / coursesWithStats.length
      : 0;

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalRevenue: (totalRevenue._sum.amount || 0) * 0.7,
      avgRating: Math.round(avgRating * 10) / 10,
      courses: coursesWithStats,
      recentReviews: reviews,
      recentEnrollments,
      monthlyRevenue,
    });
  } catch (error) {
    console.error('Instructor stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}
