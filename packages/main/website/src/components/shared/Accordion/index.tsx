import React from "react";
import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { Badge, type BadgeVariant } from "../Badge";

interface AccordionAction {
  label: string;
  href: string;
}

interface AccordionProps {
  title: string;
  /** Optional suffix displayed after the title (e.g., emoji badge) */
  titleSuffix?: React.ReactNode;
  description?: string;
  icon?: string;
  badge?: React.ReactNode;
  badgeVariant?: BadgeVariant;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** "default" = bordered, "card" = borderless card style */
  variant?: "default" | "card";
  /** Action buttons displayed on the right side of the accordion header */
  actions?: AccordionAction[];
}

export type { AccordionProps, AccordionAction };

export function Accordion({
  title,
  titleSuffix,
  description,
  icon,
  badge,
  badgeVariant = "success",
  children,
  defaultOpen = false,
  variant = "default",
  actions,
}: AccordionProps): React.ReactElement {
  const resolvedIcon = useBaseUrl(icon ?? "");
  return (
    <details className={clsx(styles.accordion, variant === "card" && styles.card)} open={defaultOpen}>
      <summary className={styles.summary}>
        {icon && <img src={resolvedIcon} alt={title} width="48" height="48" className={styles.icon} />}
        <span className={styles.titleBlock}>
          <span className={clsx(styles.title, variant === "card" && styles.titleCard)}>
            {title}
            {titleSuffix && <span className={styles.titleSuffix}>{titleSuffix}</span>}
          </span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {actions && actions.length > 0 && (
          <span className={styles.actions}>
            {actions.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className={styles.actionButton}
                onClick={(e) => e.stopPropagation()}
              >
                {action.label}
              </Link>
            ))}
          </span>
        )}
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
