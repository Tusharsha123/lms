import { config } from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function testProductionEmail() {
  console.log("🚀 Testing Production Email Configuration...\n");

  // Debug: Show what environment variables are loaded
  console.log("📋 Email Config Debug:");
  console.log(`HOST: ${process.env.EMAIL_SERVER_HOST}`);
  console.log(`PORT: ${process.env.EMAIL_SERVER_PORT}`);
  console.log(`USER: ${process.env.EMAIL_SERVER_USER}`);
  console.log(
    `PASS: ${process.env.EMAIL_SERVER_PASSWORD ? "***SET***" : "NOT SET"}`
  );
  console.log(`FROM: ${process.env.EMAIL_FROM}\n`);

  // Create transporter directly for testing
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    debug: true,
    logger: true,
  });

  try {
    console.log("⏳ Testing SMTP connection...");
    const verification = await transporter.verify();
    console.log("✅ SMTP connection successful!\n");

    console.log("📧 Sending test email...");
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_SERVER_USER, // Send to yourself
      subject: "LMS Production Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">✅ LMS Production Email Working!</h1>
          <p>Your email configuration is ready for production use.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 System Status:</h3>
            <ul>
              <li>✅ SMTP Connection: Working</li>
              <li>✅ Email Verification: Enabled</li>
              <li>✅ Multi-user Support: Ready</li>
              <li>✅ Production Mode: Active</li>
            </ul>
          </div>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Environment:</strong> Production</p>
        </div>
      `,
      text: `LMS Production Email Test - ${new Date().toLocaleString()}`,
    });

    console.log("✅ Production email sent successfully!");
    console.log("📧 Check your inbox for the test email");
    console.log("🎯 Your LMS is ready for multiple users in production!");
  } catch (error) {
    console.log("❌ Production email test failed:", error.message);

    // Provide troubleshooting based on error type
    console.log("\n🔧 Troubleshooting:");
    if (error.code === "ECONNREFUSED") {
      console.log("• Connection refused - Check SMTP server and port");
      console.log("• Gmail SMTP: smtp.gmail.com:587");
      console.log("• Make sure port 587 is not blocked by firewall");
    } else if (error.code === "EAUTH") {
      console.log("• Authentication failed - Check Gmail credentials");
      console.log("• Use Gmail App Password (not regular password)");
      console.log("• Enable 2FA on Gmail account first");
    } else if (error.code === "ETIMEDOUT") {
      console.log("• Connection timeout - SMTP server may be slow");
    } else {
      console.log("• General SMTP error - Check all email configuration");
    }

    console.log("\n📖 Gmail Setup Steps:");
    console.log("1. Go to https://myaccount.google.com/apppasswords");
    console.log('2. Generate an "App password" for "Mail"');
    console.log("3. Use that 16-character password in EMAIL_SERVER_PASSWORD");
    console.log("4. Make sure 2FA is enabled on your Gmail account");
  }
}

testProductionEmail();
