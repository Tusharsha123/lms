import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
import styles from "../../styles/Admin.module.css";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "admin")
    ) {
      router.push("/");
    } else if (session) {
      fetchDashboardData();
    }
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.recentUsers);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <Loading />;
  }

  const sidebarItems = [
    { label: "Overview", icon: "📊", href: "#" },
    { label: "Users", icon: "👥", href: "#" },
    { label: "Courses", icon: "📚", href: "#" },
    { label: "Settings", icon: "⚙️", href: "#" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Sidebar items={sidebarItems} />

        <div className={styles.main}>
          <h1>Admin Dashboard</h1>

          {stats && (
            <div className={styles.statsGrid}>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </Card>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalCourses}</h3>
                  <p>Total Courses</p>
                </div>
              </Card>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalEnrollments}</h3>
                  <p>Total Enrollments</p>
                </div>
              </Card>
            </div>
          )}

          <Card className={styles.usersCard}>
            <h2>Recent Users</h2>
            <div className={styles.usersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name || "N/A"}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button size="sm" variant="secondary">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
