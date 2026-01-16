import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "../../styles/Auth.module.css";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationOptions, setShowVerificationOptions] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowVerificationOptions(false);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("verify your email")) {
          setError(result.error);
          setShowVerificationOptions(true);
          setVerificationEmail(email);
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push("/courses");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/courses" });
  };

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    setVerificationMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationMessage(
          "Verification email sent! Please check your email."
        );
      } else {
        setVerificationMessage(
          data.error || "Failed to send verification email."
        );
      }
    } catch (err) {
      setVerificationMessage("An error occurred. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleManualVerification = async () => {
    setVerificationLoading(true);
    setVerificationMessage("");

    try {
      const response = await fetch("/api/auth/verify-email-dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationMessage(
          "Email verified successfully! You can now sign in."
        );
        setShowVerificationOptions(false);
      } else {
        setVerificationMessage(data.error || "Failed to verify email.");
      }
    } catch (err) {
      setVerificationMessage("An error occurred. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>Sign In</h1>
          <p>Welcome back to LMS Platform</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {showVerificationOptions && (
          <div className={styles.verificationOptions}>
            <h3>Email Verification Required</h3>
            <p>Your email needs to be verified before you can sign in.</p>

            {process.env.NODE_ENV !== "production" && (
              <div className={styles.devNote}>
                <strong>Development Mode:</strong> Check your email inbox for
                the verification link. If email fails, check the
                terminal/console for fallback URLs, or visit{" "}
                <a href="/dev-verification" target="_blank">
                  /dev-verification
                </a>{" "}
                to see all tokens.
              </div>
            )}

            {verificationMessage && (
              <div
                className={`${styles.message} ${
                  verificationMessage.includes("success")
                    ? styles.success
                    : styles.error
                }`}
              >
                {verificationMessage}
              </div>
            )}

            <div className={styles.verificationActions}>
              <Button
                type="button"
                onClick={handleResendVerification}
                disabled={verificationLoading}
                variant="secondary"
              >
                {verificationLoading
                  ? "Sending..."
                  : "Resend Verification Email"}
              </Button>

              {process.env.NODE_ENV !== "production" && (
                <Button
                  type="button"
                  onClick={handleManualVerification}
                  disabled={verificationLoading}
                  variant="outline"
                >
                  {verificationLoading
                    ? "Verifying..."
                    : "Verify Manually (Dev Only)"}
                </Button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.note}>
          <p>Sign in using your email and password.</p>
        </div>

        <div className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/signup">
              <strong>Sign Up</strong>
            </Link>
          </p>
          <p style={{ marginTop: "10px" }}>
            <Link
              href="/auth/forgot-password"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              <strong>Forgot Password?</strong>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
