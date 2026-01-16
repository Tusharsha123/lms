import prisma from '../../../lib/prisma';
import { generateCertificateHTML } from '../../../lib/pdf';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    const certificate = await prisma.certificate.findUnique({
      where: { uniqueCode: code },
      include: {
        user: { select: { name: true } },
        course: {
          select: { title: true },
          include: { instructor: { select: { name: true } } },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const { format } = req.query;

    if (format === 'html') {
      const html = generateCertificateHTML({
        userName: certificate.user.name || 'Student',
        courseName: certificate.course.title,
        completionDate: new Date(certificate.issuedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        certificateCode: certificate.uniqueCode,
        instructorName: certificate.course.instructor.name || 'Instructor',
      });

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
}
