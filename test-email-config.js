import { sendEmail } from "./lib/email.js";

async function testEmailConfig() {
  console.log("🧪 Testing current email configuration...\n");

  try {
    const result = await sendEmail({
      to: "test@example.com",
      subject: "LMS Email Test",
      html: `
        <h1>✅ Email Working!</h1>
        <p>Your LMS email configuration is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
      `,
      text: "Email configuration test successful!",
    });

    console.log("✅ Email sent successfully!");
    console.log("📧 Check your inbox (including spam) for the test email");
    console.log(
      "🔄 If you don't see it, try the Gmail setup instructions above"
    );
  } catch (error) {
    console.log("❌ Email test failed:", error.message);
    console.log("\n🔧 Quick Fix Options:");
    console.log("1. Use Gmail SMTP (see .env.local comments)");
    console.log("2. Use Outlook SMTP (see .env.local comments)");
    console.log("3. Skip email verification for development");
  }
}

testEmailConfig();
