import type { ReactNode, MouseEvent } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useHistory } from "@docusaurus/router";
import Heading from "@theme/Heading";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import { MODULE_LIST, type ModuleItem } from "@site/src/data/modules";

export function ModuleCard({
  name,
  logo,
  description,
  docLink,
  apiLink,
  status,
}: ModuleItem): ReactNode {
  const history = useHistory();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    history.push(docLink);
  };

  return (
    <div className={clsx("col col--4")}>
      <div
        className={clsx("text--center", styles.moduleCard)}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            history.push(docLink);
          }
        }}
        aria-label={`${name} module: ${description}`}
      >
        {status === "beta" && <span className={styles.betaBadge}>{translate({ id: 'homepage.modules.beta', message: 'Beta' })}</span>}
        <p><img src={logo} width={128} /></p>
        <Heading as="h3">{name}</Heading>
        <p className={styles.moduleDescription}>{description}</p>
        <div className={styles.moduleLinks}>
          <Link
            className={clsx("button button--sm", styles.docsButton)}
            to={docLink}
            aria-label={translate(
              { id: 'homepage.modules.docsAriaLabel', message: '{name} documentation' },
              { name }
            )}
          >
            {translate({ id: 'homepage.modules.docs', message: 'Docs' })}
          </Link>
          <Link
            className={clsx("button button--sm", styles.apiButton)}
            to={apiLink}
            aria-label={translate(
              { id: 'homepage.modules.apiAriaLabel', message: '{name} API reference' },
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
