import { useState, useEffect } from 'react';
import styles from '../styles/WishlistButton.module.css';

export default function WishlistButton({ courseId, size = 'medium' }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWishlist();
  }, [courseId]);

  const checkWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist/check?courseId=${courseId}`);
      const data = await res.json();
      setInWishlist(data.inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: inWishlist ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      
      if (res.ok) {
        setInWishlist(!inWishlist);
      }
    } catch (error) {
      console.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`${styles.button} ${styles[size]} ${inWishlist ? styles.active : ''}`}
      onClick={toggleWishlist}
      disabled={loading}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? '❤️' : '🤍'}
    </button>
  );
}
