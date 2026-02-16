import type { ReactNode } from "react";
import styles from "./styles.module.css";

interface TypeRefProps {
  children: ReactNode;
}

/**
 * Renders a type reference with monospace styling while preserving
 * markdown links inside. Use instead of backticks when the type
 * contains clickable references to other types.
 *
 * @example
 * ```mdx
 * <TypeRef>[Either](./Either.md)\<E, A\></TypeRef>
 * ```
 */
export default function TypeRef({ children }: TypeRefProps): ReactNode {
  return <code className={styles.typeRef}>{children}</code>;
}
