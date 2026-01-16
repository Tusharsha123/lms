async function testSignup() {
  try {
    console.log("🚀 Testing signup API...");

    const response = await fetch(
      "http://localhost:3000/api/auth/signup-minimal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User 3",
          email: "test3@example.com",
          password: "password123",
        }),
      }
    );

    console.log(`📡 Response status: ${response.status}`);
    console.log(
      `📡 Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("📋 Response body:", result);

    if (response.ok) {
      console.log("✅ User created successfully!");
      console.log("📧 Check your email for verification link");
      console.log("🔗 Also check the terminal for the verification URL");
    } else {
      console.log("❌ Signup failed:", result.error);
    }
  } catch (error) {
    console.error("💥 Fetch error:", error);
  }
}

testSignup();
