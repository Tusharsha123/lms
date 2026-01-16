import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const review = await prisma.review.findUnique({ where: { id } });
  
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isOwner = review.userId === session.user.id;
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PUT') {
    try {
      const { rating, comment } = req.body;

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          rating: rating ? parseInt(rating) : undefined,
          comment,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update review' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.review.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
