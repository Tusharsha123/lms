import styles from "../styles/Input.module.css";

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span>*</span>}
        </label>
      )}
      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
