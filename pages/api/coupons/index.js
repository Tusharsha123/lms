import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user.role !== 'admin' && user.role !== 'instructor') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const where = user.role === 'admin' 
        ? {} 
        : { course: { instructorId: session.user.id } };
      
      const coupons = await prisma.coupon.findMany({
        where,
        include: { course: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
      });
      
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch coupons' });
    }
  } else if (req.method === 'POST') {
    try {
      const { code, discountPercent, maxUses, expiresAt, courseId } = req.body;

      if (courseId) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        
        if (user.role !== 'admin' && course.instructorId !== session.user.id) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          discountPercent: parseInt(discountPercent),
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          courseId,
        },
      });

      res.status(201).json(coupon);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }
      res.status(500).json({ error: 'Failed to create coupon' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
