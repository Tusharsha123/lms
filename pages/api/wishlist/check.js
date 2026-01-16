import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.json({ inWishlist: false });
  }

  try {
    const { courseId } = req.query;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
}
