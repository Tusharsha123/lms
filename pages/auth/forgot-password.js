import { useState } from "react";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "../../styles/Auth.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Valid email is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request password reset");
      }

      setSuccess(
        data.message ||
          "If an account exists with this email, you'll receive a password reset link shortly. Please check your inbox and spam folder."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>Forgot Password?</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div
            style={{
              color: "#28a745",
              padding: "10px",
              backgroundColor: "#f0f9f7",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <p>
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Back to Login
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
