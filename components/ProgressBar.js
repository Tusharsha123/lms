import styles from '../styles/ProgressBar.module.css';

export default function ProgressBar({ progress, showLabel = true, size = 'medium', color = 'primary' }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.track}>
        <div 
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>{Math.round(clampedProgress)}%</span>
      )}
    </div>
  );
}
