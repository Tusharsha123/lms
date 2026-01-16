import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Error.module.css';

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>{statusCode} Error | LMS Platform</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>{statusCode}</h1>
        <p className={styles.errorMessage}>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </p>
        <Link href="/" className={styles.homeLink}>Go back home</Link>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
