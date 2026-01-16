import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Loading from "../components/Loading";
import styles from "../styles/Profile.module.css";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session) {
      fetchProfile();
    }
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
          <Button danger onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <Card className={styles.profileCard}>
          <div className={styles.avatar}>
            {session.user?.image ? (
              <img src={session.user.image} alt={session.user.name} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {session.user?.name?.[0] || "U"}
              </div>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              <label>Name</label>
              {editMode ? (
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{profile?.name || session.user?.name}</p>
              )}
            </div>

            <div className={styles.infoRow}>
              <label>Email</label>
              <p>{session.user?.email}</p>
            </div>

            <div className={styles.infoRow}>
              <label>Role</label>
              <p className={styles.role}>{profile?.role || "student"}</p>
            </div>

            <div className={styles.infoRow}>
              <label>Bio</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p>{profile?.bio || "No bio added yet"}</p>
              )}
            </div>

            <div className={styles.infoRow}>
              <label>Location</label>
              {editMode ? (
                <Input
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{profile?.location || "Not specified"}</p>
              )}
            </div>

            <div className={styles.infoRow}>
              <label>Skills</label>
              {editMode ? (
                <Input
                  name="skills"
                  value={(formData.skills || []).join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  placeholder="JavaScript, React, Node.js"
                />
              ) : (
                <div className={styles.skillsList}>
                  {profile?.skills?.length ? (
                    profile.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {editMode && (
              <div className={styles.formActions}>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className={styles.statsCard}>
          <h2>Learning Statistics</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Courses Enrolled</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Lessons Completed</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>0%</div>
              <div className={styles.statLabel}>Average Progress</div>
            </div>
          </div>
          <Link href="/my-courses">
            <Button fullWidth>View My Courses</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
