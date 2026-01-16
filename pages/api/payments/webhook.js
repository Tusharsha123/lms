import { buffer } from 'micro';
import prisma from '../../../lib/prisma';
import { constructWebhookEvent } from '../../../lib/stripe';
import { notifyEnrollment } from '../../../lib/notifications';
import { sendEnrollmentEmail } from '../../../lib/email';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = await constructWebhookEvent(buf, sig);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, courseId } = session.metadata;

        const order = await prisma.order.findFirst({
            where: { stripeSessionId: session.id },
        });

        if (order && order.couponId) {
            await prisma.coupon.update({
                where: { id: order.couponId },
                data: { usedCount: { increment: 1 } },
            });
        }

        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: 'completed', stripePaymentIntentId: session.payment_intent },
        });

        const enrollment = await prisma.enrollment.create({
          data: { userId, courseId },
        });

        const [user, course] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          prisma.course.findUnique({ where: { id: courseId } }),
        ]);

        await notifyEnrollment(userId, course.title, courseId);
        
        try {
          await sendEnrollmentEmail(user, course);
        } catch (e) {
          console.error('Failed to send enrollment email:', e);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'failed' },
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
