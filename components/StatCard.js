import styles from '../styles/StatCard.module.css';

export default function StatCard({ title, value, icon, change, changeType = 'neutral' }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
        {change !== undefined && (
          <span className={`${styles.change} ${styles[changeType]}`}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
