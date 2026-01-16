import Link from 'next/link';
import styles from '../styles/CertificateCard.module.css';

export default function CertificateCard({ certificate }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.card}>
      <div className={styles.icon}>📜</div>
      <div className={styles.content}>
        <h3 className={styles.courseTitle}>{certificate.course?.title}</h3>
        <p className={styles.instructor}>
          Instructor: {certificate.course?.instructor?.name || 'Unknown'}
        </p>
        <p className={styles.date}>Issued: {formatDate(certificate.issuedAt)}</p>
        <p className={styles.code}>ID: {certificate.uniqueCode}</p>
      </div>
      <div className={styles.actions}>
        <Link href={`/certificates/${certificate.uniqueCode}`} className={styles.viewBtn}>
          View Certificate
        </Link>
        <Link href={`/api/certificates/${certificate.uniqueCode}?format=html`} target="_blank" className={styles.downloadBtn}>
          Download
        </Link>
      </div>
    </div>
  );
}
