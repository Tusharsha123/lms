import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "../../styles/Auth.module.css";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!confirmPassword.trim()) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
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

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(data.message || "Password updated successfully!");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1>Invalid Reset Link</h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>
          <Link href="/auth/request-reset">
            <Button>Request New Reset Link</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>Reset Your Password</h1>
          <p>Enter a new password for your account</p>
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
          <div style={{ position: "relative" }}>
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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
        </div>
      </Card>
    </div>
  );
}
