import React from "react";
import styles from "./styles.module.css";
import { Badge } from "../Badge";

interface AccordionProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, badge, children, defaultOpen = false }: AccordionProps): React.ReactElement {
  return (
    <details className={styles.accordion} open={defaultOpen}>
      <summary className={styles.summary}>
        <span className={styles.title}>{title}</span>
        {badge && <Badge>{badge}</Badge>}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
