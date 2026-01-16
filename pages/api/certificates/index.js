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
      const certificates = await prisma.certificate.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            select: { id: true, title: true, thumbnail: true },
            include: { instructor: { select: { name: true } } },
          },
        },
        orderBy: { issuedAt: 'desc' },
      });

      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
