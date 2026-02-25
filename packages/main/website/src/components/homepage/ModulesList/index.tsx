import type { ReactNode, MouseEvent } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import Heading from "@theme/Heading";
import { translate } from "@docusaurus/Translate";
import { Picture } from "@site/src/components/shared/Picture";
import styles from "./styles.module.css";
import { MODULE_LIST, type ModuleItem } from "@site/src/data/modules";
import {
  ARKHE_BUNDLE_RATIO, ARKHE_PERF_RATIO,
  KANON_BUNDLE_RATIO, KANON_JIT_RATIO, KANON_V3_RATIO,
  ZYGOS_BUNDLE_RATIO, ZYGOS_PERF_RATIO,
} from "@site/src/data/generated/pre-computed-comparisons";

function formatRatio(ratio: number | null, type: "smaller" | "faster"): string {
  if (ratio == null) return translate({ id: "comparison.quick.result.na", message: "N/A" });
  if (type === "smaller") {
    return translate(
      { id: "comparison.quick.result.smaller", message: "{ratio}x smaller" },
      { ratio: ratio.toFixed(1) },
    );
  }
  if (ratio >= 1) {
    return translate(
      { id: "comparison.quick.result.faster", message: "{ratio}x faster" },
      { ratio: ratio.toFixed(1) },
    );
  }
  return translate(
    { id: "comparison.quick.result.slower", message: "{ratio}x slower" },
    { ratio: (1 / ratio).toFixed(1) },
  );
}

function formatZygosPerf(ratio: number | null): string {
  if (ratio == null) return translate({ id: "comparison.quick.result.similar", message: "Similar" });
  if (ratio >= 1.1) return translate({ id: "comparison.quick.result.faster", message: "{ratio}x faster" }, { ratio: ratio.toFixed(1) });
  if (ratio <= 0.9) return translate({ id: "comparison.quick.result.slower", message: "{ratio}x slower" }, { ratio: (1 / ratio).toFixed(1) });
  return translate({ id: "comparison.quick.result.similar", message: "Similar" });
}

const comparisons = {
  arkhe: {
    bundleSize: formatRatio(ARKHE_BUNDLE_RATIO, "smaller"),
    performance: formatRatio(ARKHE_PERF_RATIO, "faster"),
    bundleSizeLink: "/comparisons/arkhe/bundle-size/",
    performanceLink: "/comparisons/arkhe/performances/",
  },
  kanon: {
    bundleSize: formatRatio(KANON_BUNDLE_RATIO, "smaller"),
    performance: formatRatio(KANON_JIT_RATIO, "faster"),
    bundleSizeLink: "/comparisons/kanon/bundle-size/",
    performanceLink: "/comparisons/kanon/performances/",
  },
  zygos: {
    bundleSize: formatRatio(ZYGOS_BUNDLE_RATIO, "smaller"),
    performance: formatZygosPerf(ZYGOS_PERF_RATIO),
    bundleSizeLink: "/comparisons/zygos/bundle-size/",
    performanceLink: "/comparisons/zygos/performances/",
  },
};

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
        <p><Picture src={logo} alt={`${name} module logo`} displaySize={128} width={128} height={128} loading="lazy" /></p>
        <Heading as="h3">{name}</Heading>
        <p className={styles.moduleDescription}>{description}</p>
        {alternative && comparison && (
          <div className={styles.moduleComparison}>
            <span className={styles.moduleAlternative}>{alternative}</span>
            {comparisonKey === "kanon" && KANON_V3_RATIO && KANON_JIT_RATIO ? (
              <span className={styles.moduleStats}>
                {comparison.bundleSize} ·{" "}
                {translate(
                  { id: "homepage.modules.kanon.perfDual", message: "{v3}× faster ({jit}× with JIT)" },
                  { v3: KANON_V3_RATIO.toFixed(1), jit: KANON_JIT_RATIO.toFixed(1) },
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
