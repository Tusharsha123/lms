import styles from '../styles/AchievementBadge.module.css';

export default function AchievementBadge({ achievement, size = 'medium', showDetails = true }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className={`${styles.badge} ${styles[size]} ${achievement.earned ? styles.earned : styles.locked}`}>
      <div className={styles.icon}>{achievement.icon || '🏆'}</div>
      {showDetails && (
        <div className={styles.details}>
          <h4 className={styles.title}>{achievement.title}</h4>
          <p className={styles.description}>{achievement.description}</p>
          {achievement.earned && achievement.earnedAt && (
            <span className={styles.date}>Earned {formatDate(achievement.earnedAt)}</span>
          )}
        </div>
      )}
    </div>
  );
}
