import styles from "../styles/Card.module.css";

export default function Card({
  children,
  onClick,
  hover = true,
  className = "",
}) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
