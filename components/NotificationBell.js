import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/NotificationBell.module.css';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=5');

      if (!res.ok) {
        console.error(`Error fetching notifications: ${res.status} ${res.statusText}`);
        // Do not attempt to parse JSON if the request failed
        return; 
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response from server.");
        const textResponse = await res.text();
        console.error("Server response:", textResponse); // Log the HTML for debugging
        return;
      }

      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      // This will now catch network errors or errors from res.json() if it still fails
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.bell} onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Notifications</h4>
            <Link href="/notifications">View All</Link>
          </div>
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <p className={styles.empty}>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <h5>{n.title}</h5>
                  <p>{n.message}</p>
                  <button 
                    className={styles.dismissBtn} 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent markAsRead from firing
                      deleteNotification(n.id);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
