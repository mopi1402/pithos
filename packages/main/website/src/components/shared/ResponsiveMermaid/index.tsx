import React from "react";
import Mermaid from "@theme/Mermaid";
import useIsBrowser from "@docusaurus/useIsBrowser";
import styles from "./styles.module.css";
import { JSX } from "react/jsx-runtime";

interface ResponsiveMermaidProps {
  /** Mermaid diagram for desktop (horizontal LR) */
  desktop: string;
  /** Mermaid diagram for mobile (vertical TB) - optional, auto-generated from desktop if not provided */
  mobile?: string;
  /** If true, keep the diagram in LR orientation even on mobile (no conversion to TB) */
  keepHorizontal?: boolean;
}

export default function ResponsiveMermaid({
  desktop,
  mobile,
  keepHorizontal = false,
}: ResponsiveMermaidProps): JSX.Element {
  const isBrowser = useIsBrowser();

  const { desktopChart, mobileChart } = React.useMemo(() => {
    if (keepHorizontal) {
      return { desktopChart: desktop, mobileChart: desktop };
    }

    const subgraphCount = (desktop.match(/\bsubgraph\b/gi) || []).length;

    // FIX: Single subgraph renders incorrectly with LR on desktop (displays vertical)
    // and TB on mobile (displays horizontal) - Mermaid bug inverts directions.
    // Workaround: swap directions when exactly 1 subgraph.
    if (subgraphCount === 1) {
      return {
        desktopChart: desktop.replace(/((?:flowchart|graph)\s+)LR/gi, "$1TB"),
        mobileChart: mobile
          ? mobile.replace(/((?:flowchart|graph)\s+)TB/gi, "$1LR")
          : desktop, // Keep LR for mobile
      };
    }

    // Multiple subgraphs: desktop=LR, mobile=TB
    return {
      desktopChart: desktop,
      mobileChart: mobile || desktop.replace(/((?:flowchart|graph)\s+)LR/gi, "$1TB"),
    };
  }, [desktop, mobile, keepHorizontal]);

  if (!isBrowser) {
    return (
      <div className={styles.container}>
        <Mermaid value={desktopChart} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.desktop}>
        <Mermaid value={desktopChart} />
      </div>
      <div className={styles.mobile}>
        <Mermaid value={mobileChart} />
      </div>
    </div>
  );
}