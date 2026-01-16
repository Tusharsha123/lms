import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import styles from "../styles/MyCourses.module.css";

export default function MyCourses() {
  const { data: session } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      fetchEnrollments();
    }
  }, [session]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/enrollments");
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <h1>My Courses</h1>

      {enrollments.length > 0 ? (
        <div className={styles.enrollmentsGrid}>
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} hover className={styles.enrollmentCard}>
              <h3>{enrollment.course.title}</h3>
              <p>{enrollment.course.description}</p>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
              <p className={styles.progress}>{enrollment.progress}% Complete</p>

              <div className={styles.cardActions}>
                <Link href={`/courses/${enrollment.courseId}`}>
                  <Button fullWidth>Continue Learning</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={styles.noCourses}>
          <p>You haven't enrolled in any courses yet.</p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
