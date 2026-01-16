import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Loading from "../../components/Loading";
import styles from "../../styles/Analytics.module.css";

export default function Analytics() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor/analytics?period=${period}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Analytics | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Analytics</h1>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.periodSelect}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <section className={styles.section}>
          <h2>Course Performance</h2>
          <div className={styles.courseStats}>
            {data?.courseStats?.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <h3>{course.title}</h3>
                <div className={styles.statGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {course.enrollments}
                    </span>
                    <span className={styles.statLabel}>Enrollments</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {course.completions}
                    </span>
                    <span className={styles.statLabel}>Completions</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {course.completionRate}%
                    </span>
                    <span className={styles.statLabel}>Completion Rate</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      ⭐ {course.avgRating}
                    </span>
                    <span className={styles.statLabel}>Avg Rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Rating Distribution</h2>
          <div className={styles.ratingChart}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                data?.reviewsByRating?.find((r) => r.rating === rating)
                  ?.count || 0;
              const max = Math.max(
                ...(data?.reviewsByRating?.map((r) => r.count) || [1])
              );
              const width = max > 0 ? (count / max) * 100 : 0;
              return (
                <div key={rating} className={styles.ratingRow}>
                  <span className={styles.ratingLabel}>{rating} ⭐</span>
                  <div className={styles.ratingBar}>
                    <div
                      className={styles.ratingFill}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className={styles.ratingCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
