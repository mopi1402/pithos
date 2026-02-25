import type { ReactNode } from "react";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { Picture } from "@site/src/components/shared/Picture";

import styles from "../styles.module.css";

export default function NotFoundContent(): ReactNode {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Picture
            src="/img/generated/not_found"
            alt="Icarus falling"
            displaySize={100}
            sourceWidth={250}
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
            Don't worry: unlike him, you can find your way back.
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
              🗺️ Use Cases Explorer
            </Link>
            <Link to="/guide/get-started/" className={styles.link}>
              ⚡️ Get Started
            </Link>
            <Link to="/api" className={styles.link}>
              📔 API Reference
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
  );
}
