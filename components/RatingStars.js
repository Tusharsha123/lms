import styles from '../styles/RatingStars.module.css';

export default function RatingStars({ rating, onRate, size = 'medium', showCount, count }) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.stars}>
        {stars.map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : styles.empty} ${onRate ? styles.clickable : ''}`}
            onClick={() => onRate && onRate(star)}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && <span className={styles.count}>({count || 0})</span>}
      {rating > 0 && <span className={styles.rating}>{rating.toFixed(1)}</span>}
    </div>
  );
}
