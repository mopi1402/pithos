import React from "react";
import styles from "./styles.module.css";

interface RelatedLinksProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Styled block for "Related" / "Further Reading" sections.
 * Wraps a markdown list of links.
 *
 * @example
 * <RelatedLinks>
 * - [Page A](./a.md) — Description
 * - [Page B](./b.md) — Description
 * </RelatedLinks>
 *
 * <RelatedLinks title="Further Reading">
 * - [Page A](./a.md): description
 * </RelatedLinks>
 */
export function RelatedLinks({
  title = "Related",
  children,
}: RelatedLinksProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
