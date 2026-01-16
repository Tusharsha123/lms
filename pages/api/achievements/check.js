import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { notifyAchievement } from '../../../lib/notifications';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const newAchievements = [];

    const [enrollments, completedCourses, reviews, certificates] = await Promise.all([
      prisma.enrollment.count({ where: { userId: session.user.id } }),
      prisma.enrollment.count({ where: { userId: session.user.id, status: 'completed' } }),
      prisma.review.count({ where: { userId: session.user.id } }),
      prisma.certificate.count({ where: { userId: session.user.id } }),
    ]);

    const achievementsToCheck = [
      { type: 'first_enrollment', condition: enrollments >= 1, title: 'First Steps', description: 'Enrolled in your first course', icon: '🎯' },
      { type: 'first_completion', condition: completedCourses >= 1, title: 'Finisher', description: 'Completed your first course', icon: '🏆' },
      { type: 'five_completions', condition: completedCourses >= 5, title: 'Dedicated Learner', description: 'Completed 5 courses', icon: '📚' },
      { type: 'ten_completions', condition: completedCourses >= 10, title: 'Knowledge Seeker', description: 'Completed 10 courses', icon: '🎓' },
      { type: 'first_review', condition: reviews >= 1, title: 'Feedback Giver', description: 'Left your first review', icon: '⭐' },
      { type: 'first_certificate', condition: certificates >= 1, title: 'Certified', description: 'Earned your first certificate', icon: '📜' },
    ];

    for (const achievement of achievementsToCheck) {
      if (achievement.condition) {
        const existing = await prisma.achievement.findFirst({
          where: { userId: session.user.id, type: achievement.type },
        });

        if (!existing) {
          const created = await prisma.achievement.create({
            data: {
              userId: session.user.id,
              type: achievement.type,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
            },
          });
          newAchievements.push(created);
          await notifyAchievement(session.user.id, achievement.title);
        }
      }
    }

    res.json({ newAchievements, count: newAchievements.length });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
}
