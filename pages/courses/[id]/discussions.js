import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import DiscussionCard from '../../../components/DiscussionCard';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Loading from '../../../components/Loading';
import styles from '../../../styles/Discussions.module.css';

export default function CourseDiscussions() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: courseId } = router.query;
  
  const [course, setCourse] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseRes, discussionsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/discussions?courseId=${courseId}`),
      ]);
      
      const courseData = await courseRes.json();
      const discussionsData = await discussionsRes.json();
      
      setCourse(courseData);
      setDiscussions(discussionsData.discussions || []);
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, courseId }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', content: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create discussion');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Discussions - {course?.title} | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <Link href={`/courses/${courseId}`} className={styles.backLink}>
              ← Back to Course
            </Link>
            <h1>Discussions</h1>
            <p className={styles.courseName}>{course?.title}</p>
          </div>
          {session && (
            <Button onClick={() => setShowModal(true)}>New Discussion</Button>
          )}
        </div>

        <div className={styles.list}>
          {discussions.length === 0 ? (
            <div className={styles.empty}>
              <p>No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <DiscussionCard 
                key={discussion.id} 
                discussion={discussion} 
                courseId={courseId}
              />
            ))
          )}
        </div>

        {showModal && (
          <Modal onClose={() => setShowModal(false)} title="Start a Discussion">
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit">Post Discussion</Button>
            </form>
          </Modal>
        )}
      </main>
    </>
  );
}
