import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../../components/Card";
import Button from "../../components/Button";
import styles from "../../styles/Auth.module.css";

export default function EmailVerified() {
  const router = useRouter();
  const { email } = router.query;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/auth/signin");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>✅ Email Verified</h1>
          <p>Your email has been successfully verified!</p>
        </div>

        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p>
            Email: <strong>{email}</strong>
          </p>
          <p>You can now login to your account.</p>
        </div>

        <div
          className={styles.form}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <Link href="/auth/signin">
            <Button type="button" onClick={() => router.push("/auth/signin")}>
              Go to Login
            </Button>
          </Link>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
            Redirecting in {countdown}s...
          </p>
        </div>
      </Card>
    </div>
  );
}
