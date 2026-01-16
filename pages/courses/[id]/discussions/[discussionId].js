import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Button from '../../../../components/Button';
import Loading from '../../../../components/Loading';
import styles from '../../../../styles/DiscussionThread.module.css';

export default function DiscussionThread() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: courseId, discussionId } = router.query;
  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (discussionId) {
      fetchDiscussion();
    }
  }, [discussionId]);

  const fetchDiscussion = async () => {
    try {
      const res = await fetch(`/api/discussions/${discussionId}`);
      const data = await res.json();
      setDiscussion(data);
    } catch (error) {
      console.error('Failed to fetch discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent }),
      });

      if (res.ok) {
        setReplyContent('');
        fetchDiscussion();
      }
    } catch (error) {
      console.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (loading) return <Loading />;

  if (!discussion) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <p>Discussion not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{discussion.title} | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <Link href={`/courses/${courseId}/discussions`} className={styles.backLink}>
          ← Back to Discussions
        </Link>

        <article className={styles.discussion}>
          <div className={styles.header}>
            <div className={styles.badges}>
              {discussion.isPinned && <span className={styles.pinned}>📌 Pinned</span>}
              {discussion.isResolved && <span className={styles.resolved}>✓ Resolved</span>}
            </div>
            <h1>{discussion.title}</h1>
            <div className={styles.meta}>
              <div className={styles.author}>
                {discussion.user?.image ? (
                  <img src={discussion.user.image} alt="" className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {discussion.user?.name?.charAt(0)}
                  </div>
                )}
                <span>{discussion.user?.name}</span>
                {discussion.user?.role === 'instructor' && (
                  <span className={styles.instructorBadge}>Instructor</span>
                )}
              </div>
              <span className={styles.date}>{formatDate(discussion.createdAt)}</span>
            </div>
          </div>
          <div className={styles.content}>
            <p>{discussion.content}</p>
          </div>
        </article>

        <section className={styles.replies}>
          <h2>{discussion.replies?.length || 0} Replies</h2>
          
          {discussion.replies?.map((reply) => (
            <div 
              key={reply.id} 
              className={`${styles.reply} ${reply.isAnswer ? styles.answer : ''} ${reply.isInstructorReply ? styles.instructorReply : ''}`}
            >
              {reply.isAnswer && <span className={styles.answerBadge}>✓ Answer</span>}
              <div className={styles.replyHeader}>
                <div className={styles.author}>
                  {reply.user?.image ? (
                    <img src={reply.user.image} alt="" className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {reply.user?.name?.charAt(0)}
                    </div>
                  )}
                  <span>{reply.user?.name}</span>
                  {reply.isInstructorReply && (
                    <span className={styles.instructorBadge}>Instructor</span>
                  )}
                </div>
                <span className={styles.date}>{formatDate(reply.createdAt)}</span>
              </div>
              <p className={styles.replyContent}>{reply.content}</p>
            </div>
          ))}
        </section>

        {session && (
          <form onSubmit={handleReply} className={styles.replyForm}>
            <h3>Add a Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
