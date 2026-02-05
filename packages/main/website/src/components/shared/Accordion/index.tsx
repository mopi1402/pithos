import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { Badge, type BadgeVariant } from "../Badge";

interface AccordionProps {
  title: string;
  description?: string;
  icon?: string;
  badge?: React.ReactNode;
  badgeVariant?: BadgeVariant;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** "default" = bordered, "card" = borderless card style */
  variant?: "default" | "card";
}

export function Accordion({
  title,
  description,
  icon,
  badge,
  badgeVariant = "success",
  children,
  defaultOpen = false,
  variant = "default",
}: AccordionProps): React.ReactElement {
  return (
    <details className={clsx(styles.accordion, variant === "card" && styles.card)} open={defaultOpen}>
      <summary className={styles.summary}>
        {icon && <img src={icon} alt="" width="48" height="48" className={styles.icon} />}
        <span className={styles.titleBlock}>
          <span className={clsx(styles.title, variant === "card" && styles.titleCard)}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
