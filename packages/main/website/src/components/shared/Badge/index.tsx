import React from "react";
import styles from "./styles.module.css";

export type BadgeVariant = "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "success" }: BadgeProps): React.ReactElement {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
