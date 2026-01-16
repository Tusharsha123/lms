import styles from "./PriceTag.module.css";

export default function PriceTag({ price, originalPrice, size = "medium" }) {
  const numericPrice = typeof price === "number" ? price : 0;
  const numericOriginalPrice =
    typeof originalPrice === "number" ? originalPrice : 0;

  const isFree = numericPrice === 0;
  const hasDiscount =
    numericOriginalPrice > numericPrice && numericOriginalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - numericPrice / numericOriginalPrice) * 100)
    : 0;

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {isFree ? (
        <span className={styles.free}>Free</span>
      ) : (
        <>
          <span className={styles.price}>${numericPrice.toFixed(2)}</span>
          {hasDiscount && (
            <>
              <span className={styles.original}>
                ${numericOriginalPrice.toFixed(2)}
              </span>
              <span className={styles.discount}>{discountPercent}% off</span>
            </>
          )}
        </>
      )}
    </div>
  );
}
