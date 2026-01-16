import styles from '../styles/ReviewCard.module.css';
import RatingStars from './RatingStars';

export default function ReviewCard({ review, onEdit, onDelete, isOwner }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.user}>
          {review.user?.image ? (
            <img src={review.user.image} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {review.user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.name}>{review.user?.name || 'Anonymous'}</span>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <RatingStars rating={review.rating} size="small" />
      </div>
      {review.comment && <p className={styles.comment}>{review.comment}</p>}
      {isOwner && (
        <div className={styles.actions}>
          <button onClick={onEdit} className={styles.editBtn}>Edit</button>
          <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
        </div>
      )}
    </div>
  );
}
