import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import AchievementBadge from '../components/AchievementBadge';
import Loading from '../components/Loading';
import styles from '../styles/Achievements.module.css';

export default function Achievements() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchAchievements();
      checkForNew();
    }
  }, [status]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const checkForNew = async () => {
    try {
      await fetch('/api/achievements/check', { method: 'POST' });
      fetchAchievements();
    } catch (error) {
      console.error('Failed to check achievements');
    }
  };

  if (status === 'loading' || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Achievements | LMS Platform</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Achievements</h1>
          <div className={styles.progress}>
            <span className={styles.count}>{data?.totalEarned || 0} / {data?.totalPossible || 0}</span>
            <span className={styles.label}>Earned</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Earned</h2>
          <div className={styles.grid}>
            {data?.all?.filter(a => a.earned).map((achievement) => (
              <AchievementBadge key={achievement.type} achievement={achievement} />
            ))}
            {data?.all?.filter(a => a.earned).length === 0 && (
              <p className={styles.empty}>No achievements earned yet. Keep learning!</p>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Locked</h2>
          <div className={styles.grid}>
            {data?.all?.filter(a => !a.earned).map((achievement) => (
              <AchievementBadge key={achievement.type} achievement={achievement} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
