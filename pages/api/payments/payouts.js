import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { createPayout } from '../../../lib/stripe';
import { notifyPayout } from '../../../lib/notifications';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const payouts = await prisma.payout.findMany({
        where: { instructorId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });

      const earnings = await prisma.order.aggregate({
        where: {
          course: { instructorId: session.user.id },
          status: 'completed',
        },
        _sum: { amount: true },
      });

      const paidOut = await prisma.payout.aggregate({
        where: { instructorId: session.user.id, status: 'completed' },
        _sum: { amount: true },
      });

      const totalEarnings = (earnings._sum.amount || 0) * 0.7; // 70% to instructor
      const totalPaidOut = paidOut._sum.amount || 0;
      const pendingBalance = totalEarnings - totalPaidOut;

      res.json({ payouts, totalEarnings, totalPaidOut, pendingBalance });
    } catch (error) {
      console.error('Get payouts error:', error);
      res.status(500).json({ error: 'Failed to fetch payouts' });
    }
  } else if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      if (!user.stripeAccountId) {
        return res.status(400).json({ error: 'Stripe account not connected' });
      }

      // Calculate pending balance
      const earnings = await prisma.order.aggregate({
        where: {
          course: { instructorId: session.user.id },
          status: 'completed',
        },
        _sum: { amount: true },
      });
      const paidOut = await prisma.payout.aggregate({
        where: {
          instructorId: session.user.id,
          status: { in: ['pending', 'completed'] }
        },
        _sum: { amount: true },
      });
      const totalEarnings = (earnings._sum.amount || 0) * 0.7; // 70% to instructor
      const totalPaidOut = paidOut._sum.amount || 0;
      const pendingBalance = totalEarnings - totalPaidOut;

      if (amount > pendingBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      const payout = await prisma.payout.create({
        data: {
          instructorId: session.user.id,
          amount,
          currency: 'usd',
          status: 'pending',
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          periodEnd: new Date(),
        },
      });

      try {
        const transfer = await createPayout(user.stripeAccountId, amount);
        
        await prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'completed', stripePayoutId: transfer.id },
        });

        await notifyPayout(session.user.id, amount);
      } catch (stripeError) {
        await prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'failed' },
        });
        throw stripeError;
      }

      res.json({ success: true, payout });
    } catch (error) {
      console.error('Create payout error:', error);
      res.status(500).json({ error: 'Failed to process payout' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
