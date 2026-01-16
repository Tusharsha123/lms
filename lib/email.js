import nodemailer from "nodemailer";

// Create transporter - will try real email in production, fallback to console in dev
const transporter =
  process.env.NODE_ENV === "development" ||
  !process.env.EMAIL_SERVER_USER ||
  process.env.EMAIL_SERVER_USER === "your-email@gmail.com"
    ? {
        sendMail: async (mailOptions) => {
          console.log("\n" + "═".repeat(70));
          console.log("📧 EMAIL (DEVELOPMENT MODE - NOT ACTUALLY SENT)");
          console.log("═".repeat(70));
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`From: ${mailOptions.from}`);
          console.log("─".repeat(70));
          console.log(mailOptions.text);
          console.log("─".repeat(70));
          return { response: "OK" };
        },
      }
    : nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@lmsplatform.com",
    to,
    subject,
    html,
    text,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendVerificationEmail(user, token) {
  if (!process.env.NEXTAUTH_URL) {
    console.warn(
      "NEXTAUTH_URL is not defined. Email verification link might be broken."
    );
    throw new Error("NEXTAUTH_URL is not configured for email verification.");
  }
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: "Verify Your Email Address",
    html: `
      <h1>Verify Your Email</h1>
      <p>Hi ${user.name || "Learner"},</p>
      <p>Thanks for signing up! Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
    text: `Verify your email by visiting this URL: ${verificationUrl}`,
  });
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to LMS Platform!",
    html: `
      <h1>Welcome, ${user.name || "Learner"}!</h1>
      <p>Thank you for joining our learning platform.</p>
      <p>Start exploring courses and begin your learning journey today!</p>
      <a href="${process.env.NEXTAUTH_URL}/courses">Browse Courses</a>
    `,
    text: `Welcome ${
      user.name || "Learner"
    }! Thank you for joining. Start exploring courses at ${
      process.env.NEXTAUTH_URL
    }/courses`,
  });
}

export async function sendEnrollmentEmail(user, course) {
  return sendEmail({
    to: user.email,
    subject: `You're enrolled in ${course.title}!`,
    html: `
      <h1>Enrollment Confirmed!</h1>
      <p>Hi ${user.name || "Learner"},</p>
      <p>You've successfully enrolled in <strong>${course.title}</strong>.</p>
      <a href="${process.env.NEXTAUTH_URL}/courses/${
      course.id
    }">Start Learning</a>
    `,
    text: `You're enrolled in ${course.title}! Start learning at ${process.env.NEXTAUTH_URL}/courses/${course.id}`,
  });
}

export async function sendCertificateEmail(user, course, certificateUrl) {
  return sendEmail({
    to: user.email,
    subject: `Congratulations! You've earned a certificate for ${course.title}`,
    html: `
      <h1>🎉 Congratulations!</h1>
      <p>Hi ${user.name || "Learner"},</p>
      <p>You've successfully completed <strong>${course.title}</strong>!</p>
      <p>Your certificate is ready:</p>
      <a href="${certificateUrl}">View Certificate</a>
    `,
    text: `Congratulations! You've completed ${course.title}. View your certificate at ${certificateUrl}`,
  });
}

export async function sendPayoutEmail(instructor, amount) {
  return sendEmail({
    to: instructor.email,
    subject: `Payout Processed: $${amount.toFixed(2)}`,
    html: `
      <h1>Payout Processed!</h1>
      <p>Hi ${instructor.name || "Instructor"},</p>
      <p>A payout of <strong>$${amount.toFixed(
        2
      )}</strong> has been processed to your account.</p>
      <a href="${
        process.env.NEXTAUTH_URL
      }/instructor/earnings">View Earnings</a>
    `,
    text: `A payout of $${amount.toFixed(2)} has been processed. View at ${
      process.env.NEXTAUTH_URL
    }/instructor/earnings`,
  });
}

export async function sendDiscussionReplyEmail(user, discussion, replierName) {
  return sendEmail({
    to: user.email,
    subject: `New reply to your discussion: ${discussion.title}`,
    html: `
      <h1>New Reply!</h1>
      <p>Hi ${user.name || "Learner"},</p>
      <p>${replierName} replied to your discussion: <strong>${
      discussion.title
    }</strong></p>
      <a href="${process.env.NEXTAUTH_URL}/courses/${
      discussion.courseId
    }/discussions/${discussion.id}">View Discussion</a>
    `,
    text: `${replierName} replied to your discussion. View at ${process.env.NEXTAUTH_URL}/courses/${discussion.courseId}/discussions/${discussion.id}`,
  });
}
export async function sendPasswordResetEmail(user, token) {
  if (!process.env.NEXTAUTH_URL) {
    console.warn(
      "NEXTAUTH_URL is not defined. Password reset link might be broken."
    );
    throw new Error("NEXTAUTH_URL is not configured for password reset.");
  }
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name || "Learner"},</p>
      <p>We received a request to reset your password. Click the link below to create a new password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can ignore this email. Your password won't change until you set a new one.</p>
    `,
    text: `Reset your password by visiting: ${resetUrl}\n\nThis link will expire in 1 hour.`,
  });
}
