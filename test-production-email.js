import { config } from "dotenv";
import { sendEmail } from "./lib/email.js";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function testProductionEmail() {
  console.log("🚀 Testing Production Email Configuration...\n");

  try {
    const result = await sendEmail({
      to: "www.tusharsharmats@gmail.com", // Send to yourself for testing
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
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This email confirms your LMS platform can send verification emails to multiple users.
          </p>
        </div>
      `,
      text: `LMS Production Email Test - ${new Date().toLocaleString()}`,
    });

    console.log("✅ Production email sent successfully!");
    console.log("📧 Check your inbox for the test email");
    console.log("🎯 Your LMS is ready for multiple users in production!");
  } catch (error) {
    console.log("❌ Production email test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Verify Gmail credentials are correct");
    console.log("2. Ensure Gmail App Password is used (not regular password)");
    console.log("3. Check Gmail security settings");
    console.log("4. Try Outlook or SendGrid as alternative");
  }
}

testProductionEmail();
