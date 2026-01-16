import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { notifyNewReview } from '../../../lib/notifications';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { courseId, limit = 10, offset = 0 } = req.query;
      
      const where = courseId ? { courseId } : {};
      
      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, image: true } },
            course: { select: { id: true, title: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset),
        }),
        prisma.review.count({ where }),
      ]);

      const avgRating = await prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: true,
      });

      res.json({ 
        reviews, 
        total, 
        avgRating: avgRating._avg.rating || 0,
        totalReviews: avgRating._count,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { courseId, rating, comment } = req.body;

      if (!courseId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid review data' });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Must be enrolled to review' });
      }

      const existingReview = await prisma.review.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });

      if (existingReview) {
        return res.status(400).json({ error: 'Already reviewed this course' });
      }

      const review = await prisma.review.create({
        data: {
          userId: session.user.id,
          courseId,
          rating: parseInt(rating),
          comment,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { instructorId: true, title: true },
      });
      
      await notifyNewReview(course.instructorId, course.title, rating);

      res.status(201).json(review);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
