import { useState } from 'react';
import styles from '../styles/CouponInput.module.css';
import Button from './Button';

export default function CouponInput({ onApply, courseId }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), courseId }),
      });
      
      const data = await res.json();
      
      if (data.valid) {
        setResult({ success: true, discount: data.discountPercent });
        onApply(data);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      setResult({ success: false, error: 'Failed to validate coupon' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className={styles.input}
        />
        <Button onClick={handleApply} disabled={loading || !code.trim()} variant="secondary">
          {loading ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      {result && (
        <p className={result.success ? styles.success : styles.error}>
          {result.success ? `${result.discount}% discount applied!` : result.error}
        </p>
      )}
    </div>
  );
}
