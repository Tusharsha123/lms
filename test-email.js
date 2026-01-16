import { sendEmail } from "../lib/email.js";

async function testEmail() {
  try {
    console.log("🧪 Testing email configuration...\n");

    const result = await sendEmail({
      to: "test@example.com", // This will fail but show us if the SMTP connection works
      subject: "Test Email from LMS Platform",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify SMTP configuration.</p>
        <p>If you receive this, email sending is working!</p>
      `,
      text: "This is a test email to verify SMTP configuration.",
    });

    console.log("✅ Email sent successfully!");
    console.log("📧 Check your inbox for the test email");
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your SMTP credentials in .env.local");
    console.log(
      "2. Verify EMAIL_SERVER_HOST, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD"
    );
    console.log("3. Make sure your SMTP provider allows connections");
  }
}

testEmail();
