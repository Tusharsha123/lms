import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const wishlist = await prisma.wishlist.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            include: {
              instructor: { select: { id: true, name: true, image: true } },
              reviews: { select: { rating: true } },
              _count: { select: { enrollments: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const coursesWithRating = wishlist.map(w => ({
        ...w,
        course: {
          ...w.course,
          avgRating: w.course.reviews.length > 0
            ? w.course.reviews.reduce((sum, r) => sum + r.rating, 0) / w.course.reviews.length
            : 0,
          reviewCount: w.course.reviews.length,
          enrollmentCount: w.course._count.enrollments,
        },
      }));

      res.json(coursesWithRating);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  } else if (req.method === 'POST') {
    try {
      const { courseId } = req.body;

      const existing = await prisma.wishlist.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });

      if (existing) {
        return res.status(400).json({ error: 'Already in wishlist' });
      }

      const wishlistItem = await prisma.wishlist.create({
        data: { userId: session.user.id, courseId },
        include: { course: true },
      });

      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { courseId } = req.body;

      await prisma.wishlist.delete({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
