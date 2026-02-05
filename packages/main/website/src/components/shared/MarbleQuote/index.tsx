import type { ReactNode } from "react";
import styles from "./MarbleQuote.module.css";

interface MarbleQuoteProps {
  children: ReactNode;
}

export default function MarbleQuote({ children }: MarbleQuoteProps) {
  return (
    <div className={styles.marble}>
      <p className={styles.text}>{children}</p>
      <span className={styles.bottomLine} />
    </div>
  );
}
