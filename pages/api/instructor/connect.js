import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { createConnectAccount, createAccountLink } from '../../../lib/stripe';

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
    res.json({ 
      connected: !!user.stripeAccountId,
      accountId: user.stripeAccountId,
    });
  } else if (req.method === 'POST') {
    try {
      let accountId = user.stripeAccountId;

      if (!accountId) {
        const account = await createConnectAccount(user.email, user.id);
        accountId = account.id;

        await prisma.user.update({
          where: { id: session.user.id },
          data: { stripeAccountId: accountId },
        });
      }

      const accountLink = await createAccountLink(accountId, session.user.id);
      res.json({ url: accountLink.url });
    } catch (error) {
      console.error('Stripe Connect error:', error);
      res.status(500).json({ error: 'Failed to setup Stripe Connect' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
