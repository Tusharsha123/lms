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
      const { courseId, lessonId } = req.query;

      if (lessonId) {
        const progress = await prisma.lessonProgress.findUnique({
          where: { userId_lessonId: { userId: session.user.id, lessonId } },
        });
        return res.json(progress);
      }

      if (courseId) {
        const progress = await prisma.lessonProgress.findMany({
          where: { 
            userId: session.user.id,
            lesson: { courseId },
          },
          include: { lesson: { select: { id: true, title: true, order: true } } },
        });
        
        const totalLessons = await prisma.lesson.count({ where: { courseId } });
        const completedLessons = progress.filter(p => p.completed).length;
        
        return res.json({
          progress,
          totalLessons,
          completedLessons,
          percentComplete: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        });
      }

      const allProgress = await prisma.lessonProgress.findMany({
        where: { userId: session.user.id },
        include: { 
          lesson: { 
            select: { id: true, title: true, courseId: true },
            include: { course: { select: { id: true, title: true } } },
          },
        },
      });

      res.json(allProgress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  } else if (req.method === 'POST') {
    try {
      const { lessonId, completed, timeSpent } = req.body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
      });

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: lesson.courseId } },
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }

      const progress = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: session.user.id, lessonId } },
        create: {
          userId: session.user.id,
          lessonId,
          completed: completed || false,
          timeSpent: timeSpent || 0,
          completedAt: completed ? new Date() : null,
        },
        update: {
          completed: completed !== undefined ? completed : undefined,
          timeSpent: timeSpent ? { increment: timeSpent } : undefined,
          completedAt: completed ? new Date() : undefined,
        },
      });

      // Update enrollment progress
      const [totalLessons, completedLessons] = await Promise.all([
        prisma.lesson.count({ where: { courseId: lesson.courseId } }),
        prisma.lessonProgress.count({
          where: { 
            userId: session.user.id,
            lesson: { courseId: lesson.courseId },
            completed: true,
          },
        }),
      ]);

      const percentComplete = Math.round((completedLessons / totalLessons) * 100);
      
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { 
          progress: percentComplete,
          status: percentComplete === 100 ? 'completed' : 'active',
        },
      });

      res.json({ progress, percentComplete });
    } catch (error) {
      console.error('Update progress error:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
