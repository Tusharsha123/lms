import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Editor from "@monaco-editor/react";
import styles from "../../styles/LessonDetail.module.css";

export default function LessonDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const [lesson, setLesson] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLesson();
    }
  }, [id]);

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
        setCode(data.codeTemplate || "");
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    // In production, send code to backend for execution
    setOutput("Code executed successfully!");
  };

  const handleSubmitCode = async () => {
    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        setOutput("Submission successful!");
      }
    } catch (error) {
      console.error("Failed to submit code:", error);
    }
  };

  if (loading || !lesson) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{lesson.title}</h1>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      <div className={styles.content}>
        <div className={styles.lessonInfo}>
          <Card>
            <h2>Lesson Description</h2>
            <p>{lesson.description}</p>
            <p>{lesson.content}</p>
            {lesson.videoUrl && (
              <div className={styles.videoContainer}>
                <iframe
                  width="100%"
                  height="400"
                  src={lesson.videoUrl}
                  title="Lesson Video"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </Card>
        </div>

        <div className={styles.codeEditor}>
          <Card>
            <h2>Code Editor</h2>
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={code}
              onChange={setCode}
              theme="light"
            />
            <div className={styles.editorActions}>
              <Button onClick={handleRunCode} variant="primary">
                Run Code
              </Button>
              <Button onClick={handleSubmitCode} variant="success">
                Submit
              </Button>
            </div>

            {output && (
              <Card className={styles.output}>
                <h3>Output</h3>
                <pre>{output}</pre>
              </Card>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
