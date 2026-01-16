import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, courseId } = req.body;

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
      },
    });

    if (!coupon) {
      return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, error: 'Coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
    }

    if (coupon.courseId && coupon.courseId !== courseId) {
      return res.status(400).json({ valid: false, error: 'Coupon not valid for this course' });
    }

    res.json({
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
}
