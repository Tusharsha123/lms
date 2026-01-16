const bcrypt = require("bcrypt");

async function testPassword() {
  const hashed = "$2b$10$f6AssvF3ncA8mmmXb.YoBe6ZKtGAaiQ/TqVG9T4gWnJtN4HRlJ4fi";
  const password = "password123";
  const isValid = await bcrypt.compare(password, hashed);
  console.log("Password valid:", isValid);
}

testPassword().catch(console.error);
