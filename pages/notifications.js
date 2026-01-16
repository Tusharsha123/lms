import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Loading from '../components/Loading';
import styles from '../styles/Notifications.module.css';

export default function Notifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  if (status === 'loading' || loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Notifications | LMS Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllAsRead} className={styles.markAllBtn}>
              Mark all as read
            </button>
          )}
        </div>

        <div className={styles.list}>
          {notifications.length === 0 ? (
            <p className={styles.empty}>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`${styles.notification} ${!notification.read ? styles.unread : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={styles.content}>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className={styles.time}>{formatDate(notification.createdAt)}</span>
                </div>
                {notification.link && (
                  <Link href={notification.link} className={styles.link}>
                    View →
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
