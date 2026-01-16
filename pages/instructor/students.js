import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ProgressBar from "../../components/ProgressBar";
import Loading from "../../components/Loading";
import styles from "../../styles/Students.module.css";

export default function Students() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCourses();
      fetchStudents();
    }
  }, [status]);

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/instructor/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const url = selectedCourse
        ? `/api/instructor/students?courseId=${selectedCourse}`
        : "/api/instructor/students";
      const res = await fetch(url);
      const data = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Students | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Your Students</h1>
          <span className={styles.count}>{total} total</span>
        </div>

        <div className={styles.filters}>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={styles.courseFilter}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className={styles.studentList}>
            {students.map((enrollment) => (
              <div key={enrollment.id} className={styles.studentCard}>
                <div className={styles.studentInfo}>
                  {enrollment.user?.image ? (
                    <img
                      src={enrollment.user.image}
                      alt=""
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {enrollment.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className={styles.details}>
                    <h3>{enrollment.user?.name || "Unknown"}</h3>
                    <p>{enrollment.user?.email}</p>
                    <p className={styles.courseName}>
                      {enrollment.course?.title}
                    </p>
                  </div>
                </div>
                <div className={styles.progress}>
                  <ProgressBar progress={enrollment.progressPercent} />
                  <span>
                    {enrollment.completedLessons}/{enrollment.totalLessons}{" "}
                    lessons
                  </span>
                </div>
                <div className={styles.meta}>
                  <span
                    className={`${styles.status} ${styles[enrollment.status]}`}
                  >
                    {enrollment.status}
                  </span>
                  <span className={styles.date}>
                    Enrolled{" "}
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className={styles.empty}>No students found</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
