import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { createCheckoutSession } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { courseId, couponCode } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    let finalPrice = course.price;
    let coupon = null;

    if (couponCode) {
      const potentialCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (potentialCoupon && potentialCoupon.isActive) {
        const isExpired = potentialCoupon.expiresAt && potentialCoupon.expiresAt < new Date();
        const maxUsesExceeded = potentialCoupon.maxUses != null && potentialCoupon.usedCount >= potentialCoupon.maxUses;
        const isForThisCourse = !potentialCoupon.courseId || potentialCoupon.courseId === courseId;

        if (!isExpired && !maxUsesExceeded && isForThisCourse) {
          coupon = potentialCoupon;
          finalPrice = course.price * (1 - coupon.discountPercent / 100);
        }
      }
    }

    if (finalPrice <= 0) {
      const enrollment = await prisma.enrollment.create({
        data: { userId: session.user.id, courseId },
      });
      
      await prisma.order.create({
        data: {
          userId: session.user.id,
          courseId,
          amount: 0,
          status: 'completed',
          couponId: coupon?.id,
        },
      });

      if (coupon) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return res.json({ success: true, free: true, enrollmentId: enrollment.id });
    }

    const checkoutSession = await createCheckoutSession({
      courseId,
      courseTitle: course.title,
      price: finalPrice,
      userId: session.user.id,
      userEmail: session.user.email,
      couponCode: coupon?.code,
    });

    await prisma.order.create({
      data: {
        userId: session.user.id,
        courseId,
        amount: finalPrice,
        status: 'pending',
        stripeSessionId: checkoutSession.id,
        couponId: coupon?.id,
      },
    });

    res.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
