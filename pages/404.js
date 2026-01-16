import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Error.module.css'; // Assuming you'll create this CSS module

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.errorMessage}>Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" className={styles.homeLink}>Go back home</Link>
      </div>
    </>
  );
}
