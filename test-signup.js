async function testSignup() {
  const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Test User",
      email: "test2@example.com",
      password: "password123",
    }),
  });

  const result = await response.json();
  console.log("Signup Response:", result);

  if (response.ok) {
    console.log("✅ User created successfully!");
    console.log("📧 Check your email for verification link");
    console.log("🔗 Also check the terminal for the verification URL");
  } else {
    console.log("❌ Signup failed:", result.error);
  }
}

testSignup();
