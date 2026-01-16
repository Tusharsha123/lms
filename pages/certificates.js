import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loading from '../components/Loading';
import styles from '../styles/Certificates.module.css';

export default function Certificates() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchCertificates();
    }
  }, [status]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>My Certificates | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <h1>My Certificates</h1>
        
        {certificates.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📜</div>
            <h2>No certificates yet</h2>
            <p>Complete courses to earn certificates!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
