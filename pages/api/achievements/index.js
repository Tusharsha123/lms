import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

const ACHIEVEMENT_DEFINITIONS = [
  { type: 'first_enrollment', title: 'First Steps', description: 'Enrolled in your first course', icon: '🎯' },
  { type: 'first_completion', title: 'Finisher', description: 'Completed your first course', icon: '🏆' },
  { type: 'five_completions', title: 'Dedicated Learner', description: 'Completed 5 courses', icon: '📚' },
  { type: 'ten_completions', title: 'Knowledge Seeker', description: 'Completed 10 courses', icon: '🎓' },
  { type: 'first_review', title: 'Feedback Giver', description: 'Left your first review', icon: '⭐' },
  { type: 'streak_7', title: 'Week Warrior', description: 'Learned for 7 days in a row', icon: '🔥' },
  { type: 'streak_30', title: 'Monthly Master', description: 'Learned for 30 days in a row', icon: '💪' },
  { type: 'first_certificate', title: 'Certified', description: 'Earned your first certificate', icon: '📜' },
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const earned = await prisma.achievement.findMany({
        where: { userId: session.user.id },
        orderBy: { earnedAt: 'desc' },
      });

      const earnedTypes = new Set(earned.map(a => a.type));
      
      const all = ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        earned: earnedTypes.has(def.type),
        earnedAt: earned.find(a => a.type === def.type)?.earnedAt,
      }));

      res.json({ earned, all, totalEarned: earned.length, totalPossible: ACHIEVEMENT_DEFINITIONS.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
