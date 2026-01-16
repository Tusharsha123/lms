import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import styles from "../../styles/InstructorDashboard.module.css";

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/instructor/stats");
      if (res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Instructor Dashboard | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Instructor Dashboard</h1>
          <Link href="/courses/create" className={styles.createBtn}>
            + Create Course
          </Link>
        </div>

        <div className={styles.stats}>
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses || 0}
            icon="📚"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon="👥"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon="💰"
          />
          <StatCard
            title="Avg Rating"
            value={stats?.avgRating?.toFixed(1) || "0.0"}
            icon="⭐"
          />
        </div>

        <div className={styles.grid}>
          <section className={styles.section}>
            <h2>Your Courses</h2>
            <div className={styles.courseList}>
              {stats?.courses?.map((course) => (
                <div key={course.id} className={styles.courseItem}>
                  <div className={styles.courseInfo}>
                    <h3>{course.title}</h3>
                    <div className={styles.courseMeta}>
                      <span>{course.studentCount} students</span>
                      <span>{course.lessonCount} lessons</span>
                      <span>⭐ {course.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className={styles.courseActions}>
                    <Link href={`/courses/${course.id}`}>View</Link>
                    <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/instructor/courses" className={styles.viewAll}>
              View All Courses →
            </Link>
          </section>

          <section className={styles.section}>
            <h2>Recent Enrollments</h2>
            <div className={styles.enrollmentList}>
              {stats?.recentEnrollments?.map((enrollment) => (
                <div key={enrollment.id} className={styles.enrollmentItem}>
                  <div className={styles.studentInfo}>
                    {enrollment.user?.image ? (
                      <img
                        src={enrollment.user.image}
                        alt=""
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {enrollment.user?.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className={styles.studentName}>
                        {enrollment.user?.name}
                      </p>
                      <p className={styles.courseName}>
                        {enrollment.course?.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/instructor/students" className={styles.viewAll}>
              View All Students →
            </Link>
          </section>

          <section className={styles.section}>
            <h2>Recent Reviews</h2>
            <div className={styles.reviewList}>
              {stats?.recentReviews?.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewerName}>
                      {review.user?.name}
                    </span>
                    <span className={styles.reviewRating}>
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p className={styles.reviewCourse}>{review.course?.title}</p>
                  {review.comment && (
                    <p className={styles.reviewComment}>"{review.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.quickLinks}>
          <Link href="/instructor/analytics" className={styles.quickLink}>
            📊 Analytics
          </Link>
          <Link href="/instructor/students" className={styles.quickLink}>
            👥 Students
          </Link>
          <Link href="/instructor/earnings" className={styles.quickLink}>
            💰 Earnings
          </Link>
          <Link href="/instructor/coupons" className={styles.quickLink}>
            🎟️ Coupons
          </Link>
        </div>
      </main>
    </>
  );
}
