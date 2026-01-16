import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar({ items = [] }) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              router.pathname === item.href ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
