import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../../components/Card";
import Button from "../../components/Button";
import styles from "../../styles/Auth.module.css";

export default function AuthDebug() {
  const [users, setUsers] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch("/api/auth/debug");
      if (!response.ok) throw new Error("Failed to fetch debug info");

      const data = await response.json();
      setUsers(data.users || []);
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === "production") {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <h1>Debug Info</h1>
          <p>This page is only available in development mode.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1>🐛 Authentication Debug</h1>

        {error && <div className={styles.error}>Error: {error}</div>}

        <div style={{ marginTop: "20px" }}>
          <h2>📋 Users in Database</h2>
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <div
              style={{
                color: "#ff6b6b",
                padding: "10px",
                backgroundColor: "#ffe0e0",
                borderRadius: "4px",
              }}
            >
              <p>❌ No users found in database!</p>
              <p>Run this command to create a test user:</p>
              <code
                style={{
                  display: "block",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  marginTop: "10px",
                }}
              >
                node create-test-user-dev.js
              </code>
              <p style={{ marginTop: "10px" }}>
                Or signup at <Link href="/auth/signup">/auth/signup</Link>
              </p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "10px" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    Verified
                  </th>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    Password Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{user.email}</td>
                    <td style={{ padding: "10px" }}>{user.name}</td>
                    <td style={{ padding: "10px" }}>
                      {user.emailVerified ? "✅ Yes" : "❌ No"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {user.hashedPassword ? "✅ Set" : "❌ Not Set"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>🔐 Email Verification Tokens</h2>
          {tokens.length === 0 ? (
            <p style={{ color: "#666" }}>No pending verification tokens</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    User ID
                  </th>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    Token (truncated)
                  </th>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    Expires
                  </th>
                  <th style={{ textAlign: "left", padding: "10px" }}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px", fontSize: "12px" }}>
                      {token.userId.slice(0, 8)}...
                    </td>
                    <td style={{ padding: "10px", fontSize: "12px" }}>
                      {token.token.slice(0, 16)}...
                    </td>
                    <td style={{ padding: "10px", fontSize: "12px" }}>
                      {new Date(token.expiresAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px", fontSize: "12px" }}>
                      {new Date(token.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#e7f5ff",
            borderRadius: "4px",
          }}
        >
          <h3>ℹ️ Test Credentials</h3>
          <p>
            <strong>Email:</strong> test@example.com
          </p>
          <p>
            <strong>Password:</strong> password123
          </p>
          <Link href="/auth/signin">
            <Button>Go to Sign In</Button>
          </Link>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button onClick={fetchDebugInfo}>🔄 Refresh</Button>
          <Link href="/" style={{ marginLeft: "10px" }}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
