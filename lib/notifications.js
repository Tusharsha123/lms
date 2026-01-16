import prisma from './prisma';

export async function createNotification({ userId, title, message, type = 'info', link = null }) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}

export async function createBulkNotifications(userIds, { title, message, type = 'info', link = null }) {
  return prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId,
      title,
      message,
      type,
      link,
    })),
  });
}

export async function notifyEnrollment(userId, courseName, courseId) {
  return createNotification({
    userId,
    title: 'Enrollment Successful!',
    message: `You've enrolled in "${courseName}". Start learning now!`,
    type: 'success',
    link: `/courses/${courseId}`,
  });
}

export async function notifyNewReview(instructorId, courseName, rating) {
  return createNotification({
    userId: instructorId,
    title: 'New Course Review',
    message: `Your course "${courseName}" received a ${rating}-star review.`,
    type: 'info',
  });
}

export async function notifyCertificateEarned(userId, courseName, certificateId) {
  return createNotification({
    userId,
    title: '🎉 Certificate Earned!',
    message: `Congratulations! You've earned a certificate for "${courseName}".`,
    type: 'success',
    link: `/certificates/${certificateId}`,
  });
}

export async function notifyDiscussionReply(userId, discussionTitle, courseId, discussionId) {
  return createNotification({
    userId,
    title: 'New Reply to Your Discussion',
    message: `Someone replied to "${discussionTitle}".`,
    type: 'info',
    link: `/courses/${courseId}/discussions#${discussionId}`,
  });
}

export async function notifyPayout(instructorId, amount) {
  return createNotification({
    userId: instructorId,
    title: 'Payout Processed',
    message: `$${amount.toFixed(2)} has been transferred to your account.`,
    type: 'success',
    link: '/instructor/earnings',
  });
}

export async function notifyAchievement(userId, achievementTitle) {
  return createNotification({
    userId,
    title: '🏆 Achievement Unlocked!',
    message: `You've earned the "${achievementTitle}" achievement!`,
    type: 'success',
    link: '/achievements',
  });
}
