import nodemailer from "nodemailer";

async function diagnoseEmail() {
  console.log("🔍 Diagnosing email configuration...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(
    `EMAIL_SERVER_HOST: ${process.env.EMAIL_SERVER_HOST || "NOT SET"}`
  );
  console.log(
    `EMAIL_SERVER_PORT: ${process.env.EMAIL_SERVER_PORT || "NOT SET"}`
  );
  console.log(
    `EMAIL_SERVER_USER: ${process.env.EMAIL_SERVER_USER || "NOT SET"}`
  );
  console.log(
    `EMAIL_SERVER_PASSWORD: ${
      process.env.EMAIL_SERVER_PASSWORD ? "***SET***" : "NOT SET"
    }`
  );
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || "NOT SET"}`);
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "NOT SET"}\n`);

  // Test SMTP connection
  console.log("🔌 Testing SMTP connection...");

  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    // Add debug logging
    debug: true,
    logger: true,
  });

  try {
    // Verify connection
    console.log("⏳ Verifying SMTP connection...");
    const verification = await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    // Test email sending
    console.log("📧 Testing email sending...");
    const testResult = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "test@example.com",
      to: "test@example.com", // This will fail but show us the SMTP response
      subject: "LMS Email Test",
      text: "This is a test email from the LMS platform.",
      html: "<h1>Test Email</h1><p>This is a test email from the LMS platform.</p>",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", testResult.messageId);
    console.log("Response:", testResult.response);
  } catch (error) {
    console.log("❌ SMTP Error:", error.message);

    // Provide troubleshooting based on error type
    console.log("\n🔧 Troubleshooting:");

    if (error.code === "ECONNREFUSED") {
      console.log("• Connection refused - Check if SMTP server is accessible");
      console.log("• Verify EMAIL_SERVER_HOST and EMAIL_SERVER_PORT");
      console.log("• Check firewall/network restrictions");
    } else if (error.code === "EAUTH") {
      console.log(
        "• Authentication failed - Check EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD"
      );
      console.log("• Verify credentials with your email provider");
    } else if (error.code === "ETIMEDOUT") {
      console.log(
        "• Connection timeout - SMTP server may be slow or unreachable"
      );
    } else {
      console.log("• General SMTP error - Check all email configuration");
    }

    console.log("\n📖 Common Solutions:");
    console.log("1. Verify SMTP credentials in your email provider dashboard");
    console.log("2. Check if SMTP relay is enabled for your account");
    console.log("3. Try using a different SMTP port (587 vs 465)");
    console.log("4. Check if your IP is whitelisted in SMTP settings");
    console.log(
      "5. Try using a different email service (Gmail, SendGrid, etc.)"
    );
  }
}

diagnoseEmail();
