import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DevVerificationTokens() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      router.push("/");
      return;
    }

    const fetchTokens = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.push("/auth/signin");
          return;
        }

        const response = await fetch("/api/auth/dev-tokens");
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch verification tokens");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [router]);

  if (process.env.NODE_ENV === "production") {
    return <div>This page is only available in development mode.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Development: Email Verification Tokens</h1>
      <p>This page shows unverified users and their verification status.</p>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f8ff",
          borderRadius: "8px",
        }}
      >
        <h3>📋 Instructions:</h3>
        <ul>
          <li>
            Check your terminal/console for verification URLs after signup
          </li>
          <li>Copy the verification URL and paste it in your browser</li>
          <li>Or use the manual verification option on the sign-in page</li>
        </ul>
      </div>

      <h2>Unverified Users ({users.length})</h2>

      {users.length === 0 ? (
        <p>No unverified users found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{user.name || "Unnamed User"}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              {user.verificationToken ? (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "#fff3cd",
                    borderRadius: "4px",
                  }}
                >
                  <p>
                    <strong>Status:</strong> Has verification token
                  </p>
                  <p>
                    <strong>Token Expires:</strong>{" "}
                    {new Date(
                      user.verificationToken.expiresAt
                    ).toLocaleString()}
                  </p>
                  <p style={{ fontSize: "0.9em", color: "#666" }}>
                    Note: Check server console logs for the actual verification
                    URL after signup.
                  </p>
                </div>
              ) : (
                <p style={{ color: "#dc3545" }}>No verification token found</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
