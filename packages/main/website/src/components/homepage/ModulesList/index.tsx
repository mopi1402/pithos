import type { ReactNode, MouseEvent } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import Heading from "@theme/Heading";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import { MODULE_LIST, type ModuleItem } from "@site/src/data/modules";
import {
  calculateArkheComparison,
  calculateKanonComparison,
  calculateZygosComparison,
  calculateKanonV3Ratio,
  calculateKanonJITRatio,
} from "@site/src/components/comparisons/QuickComparisonTable/calculations";

const comparisons = {
  arkhe: calculateArkheComparison(),
  kanon: calculateKanonComparison(),
  zygos: calculateZygosComparison(),
};

const kanonV3Ratio = calculateKanonV3Ratio();
const kanonJITRatio = calculateKanonJITRatio();

export function ModuleCard({
  name,
  logo,
  description,
  docLink,
  apiLink,
  status,
  alternative,
  comparisonKey,
}: ModuleItem): ReactNode {
  const history = useHistory();
  const comparison = comparisonKey ? comparisons[comparisonKey] : null;

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    history.push(docLink);
  };

  return (
    <div className={clsx("col col--4")}>
      <div
        className={clsx("text--center", styles.moduleCard)}
        onClick={handleCardClick}
        role="group"
        aria-label={`${name}`}
      >
        {status === "beta" && <span className={styles.betaBadge}>{translate({ id: 'homepage.modules.beta', message: 'Beta' })}</span>}
        <p><img src={logo} alt={`${name} module logo`} width={128} height={128} loading="lazy" decoding="async" /></p>
        <Heading as="h3">{name}</Heading>
        <p className={styles.moduleDescription}>{description}</p>
        {alternative && comparison && (
          <div className={styles.moduleComparison}>
            <span className={styles.moduleAlternative}>{alternative}</span>
            {comparisonKey === "kanon" && kanonV3Ratio && kanonJITRatio ? (
              <span className={styles.moduleStats}>
                {comparison.bundleSize} ·{" "}
                {translate(
                  { id: "homepage.modules.kanon.perfDual", message: "{v3}× faster ({jit}× with JIT)" },
                  { v3: kanonV3Ratio.toFixed(1), jit: kanonJITRatio.toFixed(1) },
                )}
              </span>
            ) : (
              <span className={styles.moduleStats}>
                {comparison.bundleSize} · {comparison.performance}
              </span>
            )}
          </div>
        )}
        {alternative && !comparison && (
          <div className={styles.moduleComparison}>
            <span className={styles.moduleAlternative}>{alternative}</span>
          </div>
        )}
        <div className={styles.moduleLinks}>
          <Link
            className={clsx("button button--sm", styles.docsButton)}
            to={docLink}
            aria-label={translate(
              { id: 'homepage.modules.docsAriaLabel', message: '{name} Docs' },
              { name }
            )}
          >
            {translate({ id: 'homepage.modules.docs', message: 'Docs' })}
          </Link>
          <Link
            className={clsx("button button--sm", styles.apiButton)}
            to={apiLink}
            aria-label={translate(
              { id: 'homepage.modules.apiAriaLabel', message: '{name} API' },
              { name }
            )}
          >
            {translate({ id: 'homepage.modules.api', message: 'API' })}
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ModulesListProps {
  modules?: ModuleItem[];
}

export default function ModulesList({
  modules = MODULE_LIST,
}: ModulesListProps): ReactNode {
  return (
    <section className={styles.modulesSection} aria-label={translate({ id: 'homepage.modules.ariaLabel', message: 'Available modules' })}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          {translate({ id: 'homepage.modules.title', message: 'Modules' })}
        </Heading>
        <div className={clsx("row", styles.modulesGrid)}>
          {modules.map((module, idx) => (
            <ModuleCard key={idx} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
}
