import type { ReactNode } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import VortexCanvas from "@site/src/components/VortexCanvas";
import KeyFigures from "@site/src/components/KeyFigures";
import FeaturesGrid from "@site/src/components/FeaturesGrid";
import ModulesList from "@site/src/components/ModulesList";
import { VORTEX_CONFIGS } from "@site/src/data/vortex";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroImage}>
          <picture>
            <source srcSet="/img/logos/pithos.webp" type="image/webp" />
            <img src="/img/logos/pithos.png" alt="Pithos" />
          </picture>
        </div>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Pithos</h1>
          <p className={styles.heroTagline}>
            <span style={{whiteSpace: 'nowrap'}}>Everything you need.</span>{' '}
            <span style={{whiteSpace: 'nowrap'}}>Nothing you don't.</span>
            <br className={styles.desktopBreak} />
            <span style={{whiteSpace: 'nowrap'}}>Zero dependencies.</span>{' '}
            <span style={{whiteSpace: 'nowrap'}}>100%{'\u00A0'}TypeScript.</span>
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.buttonPrimary} to="/guide/quick-start">
              Get Started
            </Link>
            <Link className={styles.buttonSecondary} to="/guide/basics/practical-example">
              Pithos in Action
            </Link>
            <Link className={styles.buttonSecondary} to="/comparisons/overview">
              Yet another toolkit?
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Complete TypeScript utilities ecosystem. Zero dependencies. 100% TypeScript."
    >
      <VortexCanvas configs={VORTEX_CONFIGS} />
      <HomepageHeader />
      <main>
        <KeyFigures />
        <FeaturesGrid />
        <ModulesList />
      </main>
    </Layout>
  );
}
