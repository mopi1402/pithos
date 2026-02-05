import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface MutedProps {
  children: ReactNode;
}

export default function Muted({ children }: MutedProps): ReactNode {
  return <div className={styles.muted}>{children}</div>;
}
