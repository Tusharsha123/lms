import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "../../styles/CreateCourse.module.css";

export default function CreateCourse() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web-development",
    level: "beginner",
    duration: "",
    price: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const course = await res.json();
        router.push(`/courses/${course.id}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className={styles.container}>
        <p>Please sign in to create courses.</p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create New Course</h1>
        <p>Share your knowledge with students worldwide</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Advanced React Patterns"
            required
          />

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn"
              rows="6"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="web-development">Web Development</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="design">Design</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.formGroup}>
                <label>Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <Input
                label="Duration (hours)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className={styles.col}>
              <Input
                label="Price ($)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Creating..." : "Create Course"}
            </Button>
            <Link href="/courses">
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
