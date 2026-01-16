import Link from 'next/link';
import styles from '../styles/DiscussionCard.module.css';

export default function DiscussionCard({ discussion, courseId }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });

  return (
    <Link href={`/courses/${courseId}/discussions/${discussion.id}`} className={styles.card}>
      <div className={styles.header}>
        {discussion.isPinned && <span className={styles.pinned}>📌</span>}
        {discussion.isResolved && <span className={styles.resolved}>✓ Resolved</span>}
      </div>
      <h3 className={styles.title}>{discussion.title}</h3>
      <p className={styles.preview}>{discussion.content.substring(0, 150)}...</p>
      <div className={styles.meta}>
        <div className={styles.user}>
          {discussion.user?.image ? (
            <img src={discussion.user.image} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{discussion.user?.name?.charAt(0)}</div>
          )}
          <span>{discussion.user?.name}</span>
        </div>
        <span className={styles.replies}>{discussion._count?.replies || 0} replies</span>
        <span className={styles.date}>{formatDate(discussion.createdAt)}</span>
      </div>
    </Link>
  );
}
