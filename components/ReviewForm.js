import { useState } from 'react';
import styles from '../styles/ReviewForm.module.css';
import RatingStars from './RatingStars';
import Button from './Button';

export default function ReviewForm({ onSubmit, initialRating = 0, initialComment = '', submitLabel = 'Submit Review' }) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.ratingSection}>
        <label>Your Rating</label>
        <RatingStars rating={rating} onRate={setRating} size="large" />
      </div>
      <div className={styles.commentSection}>
        <label htmlFor="comment">Your Review (optional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this course..."
          rows={4}
        />
      </div>
      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}
