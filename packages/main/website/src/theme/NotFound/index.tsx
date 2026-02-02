import type { ReactNode } from "react";
import Translate from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

export default function NotFound(): ReactNode {
  return (
    <>
      <PageMetadata
        title="Page Not Found"
        description="The page you are looking for does not exist."
      />
      <Layout>
        <main className={styles.container}>
          <div className={styles.content}>
            <div className={styles.titleRow}>
              <img
                src="/img/not_found.png"
                alt="Icarus falling"
                className={styles.illustration}
              />
              <h1 className={styles.title}>404</h1>
            </div>
            <h2 className={styles.subtitle}>
              <Translate id="theme.NotFound.title">
                Lost in Daedalus' Labyrinth?
              </Translate>
            </h2>
            <p className={styles.description}>
              <Translate id="theme.NotFound.p1">
                Like Icarus, this page flew too close to the sun and melted away.
                Don't worry — unlike him, you can find your way back.
              </Translate>
            </p>

            <div className={styles.suggestions}>
              <p className={styles.suggestionsTitle}>
                <Translate id="theme.NotFound.suggestions">
                  Perhaps you were looking for:
                </Translate>
              </p>
              <div className={styles.links}>
                <Link to="/use-cases" className={styles.link}>
                  Use Cases Explorer
                </Link>
                <Link to="/guide/quick_start/" className={styles.link}>
                  Quick Start
                </Link>
                <Link to="/api" className={styles.link}>
                  API Reference
                </Link>
              </div>
            </div>

            <Link to="/" className={styles.homeButton}>
              <Translate id="theme.NotFound.backHome">
                Return to Olympus
              </Translate>
            </Link>
          </div>
        </main>
      </Layout>
    </>
  );
}
