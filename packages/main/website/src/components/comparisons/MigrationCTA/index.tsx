import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

interface MigrationCTAProps {
  /** Module name (e.g. "Kanon", "Zygos", "Arkhe") */
  module: string;
  /** Link to the migration guide section */
  guideLink: string;
  /** Short description of what the guide covers */
  guideDescription?: string;
}

/**
 * Call-to-action block for migration guides on comparison pages.
 * Links to the consolidated guide in the module documentation.
 */
export function MigrationCTA({
  module,
  guideLink,
  guideDescription,
}: MigrationCTAProps): React.ReactElement {
  return (
    <>
      <div className={styles.cta}>
        <p>
          {translate(
            { id: "comparison.migration.ready", message: "Ready to migrate? The complete step-by-step migration guide is in the {module} module documentation" },
            { module }
          )}
          {guideDescription && `: ${guideDescription}`}
          {". "}
          <a href={guideLink}>
            <strong>{translate({ id: "comparison.migration.link", message: "Go to migration guide →" })}</strong>
          </a>
        </p>
      </div>
      <p className={styles.overview}>
        {translate({ id: "comparison.migration.overview", message: "Not sure which library fits your use case?" })}{" "}
        <a href="/comparisons/overview/#-when-to-use-each-module">
          {translate({ id: "comparison.migration.overviewLink", message: "See the comparison overview." })}
        </a>
      </p>
    </>
  );
}
