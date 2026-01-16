import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styles from "../../styles/CreateLesson.module.css";

export default function CreateLesson() {
  const router = useRouter();
  const { courseId } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    codeTemplate: "",
    videoUrl: "",
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId }),
      });

      if (res.ok) {
        router.push(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error("Failed to create lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Lesson</h1>

      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Lesson Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Code Template (optional)</label>
            <textarea
              name="codeTemplate"
              value={formData.codeTemplate}
              onChange={handleChange}
              rows="4"
              placeholder="// Starting code"
            />
          </div>

          <Input
            label="Video URL (optional)"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            type="url"
          />

          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
          />

          <div className={styles.actions}>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Lesson"}
            </Button>
            <Link href={`/courses/${courseId}`}>
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
