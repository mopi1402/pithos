import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface PatternNavProps {
  /** The module name (e.g., "eidos") */
  module?: string;
}

/**
 * Navigation component for pattern pages.
 * Displays a link back to the pattern index.
 */
export function PatternNav({ module = "eidos" }: PatternNavProps) {
  const indexUrl = `/api/${module}/`;
  const label = module.charAt(0).toUpperCase() + module.slice(1);

  return (
    <div className={styles.patternNav}>
      <Link to={indexUrl} className={styles.indexLink}>
        ← All {label} Patterns
      </Link>
    </div>
  );
}
