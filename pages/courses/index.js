import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import styles from "../../styles/Courses.module.css";

export default function Courses() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || course.level === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Courses</h1>
        {session?.user?.role === "instructor" && (
          <Link href="/courses/create">
            <Button>Create Course</Button>
          </Link>
        )}
      </div>

      <div className={styles.filters}>
        <Input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className={styles.coursesGrid}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card hover className={styles.courseCard}>
                <div className={styles.courseThumbnail}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                  ) : (
                    <div className={styles.placeholderThumbnail}>📚</div>
                  )}
                </div>
                <div className={styles.courseContent}>
                  <h3>{course.title}</h3>
                  <p className={styles.description}>{course.description}</p>
                  <div className={styles.courseFooter}>
                    <span className={styles.level}>{course.level}</span>
                    <span className={styles.students}>
                      {course.students || 0} students
                    </span>
                  </div>
                  {course.price > 0 && (
                    <div className={styles.price}>
                      ${course.price.toFixed(2)}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className={styles.noCourses}>
            <p>No courses found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
