import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import { generateCertificateCode, generateCertificateHTML } from '../../../lib/pdf';
import { notifyCertificateEarned } from '../../../lib/notifications';
import { sendCertificateEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { courseId } = req.body;

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (!enrollment || enrollment.progress < 100) {
      return res.status(400).json({ error: 'Course not completed' });
    }

    const existingCert = await prisma.certificate.findFirst({
      where: { userId: session.user.id, courseId },
    });

    if (existingCert) {
      return res.json(existingCert);
    }

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.course.findUnique({ 
        where: { id: courseId },
        include: { instructor: { select: { name: true } } },
      }),
    ]);

    const certificateCode = generateCertificateCode();
    const certificateUrl = `/certificates/${certificateCode}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: session.user.id,
        courseId,
        uniqueCode: certificateCode,
        certificateUrl,
      },
      include: { course: true },
    });

    await notifyCertificateEarned(session.user.id, course.title, certificate.id);

    try {
      await sendCertificateEmail(user, course, `${process.env.NEXTAUTH_URL}${certificateUrl}`);
    } catch (e) {
      console.error('Failed to send certificate email:', e);
    }

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
}
