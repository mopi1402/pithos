import React from "react";
import styles from "./styles.module.css";
import { Table, Column } from "../Table";

// Import the generated data
import bundleData from "../../data/arkhe-bundle-sizes.json";

interface BundleResult {
  utilName: string;
  category: string;
  library: string;
  libraryFunctionName: string | null;
  rawBytes: number | null;
  gzipBytes: number | null;
  brotliBytes: number | null;
  error?: string;
}

interface ModuleData {
  topUtils: string[];
  libraries: string[];
  results: BundleResult[];
}

interface BundleData {
  generatedAt: string;
  versions: Record<string, string>;
  modules: {
    arkhe: ModuleData;
    taphos: ModuleData;
  };
}

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} kB`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Library display names
const libraryNames: Record<string, string> = {
  pithos: "Pithos",
  lodash: "Lodash",
  "es-toolkit": "es-toolkit",
  "es-toolkit/compat": "es-toolkit/compat",
  remeda: "Remeda",
  radashi: "Radashi",
};

interface ArkheBundleTableProps {
  module?: "arkhe" | "taphos";
  maxRows?: number;
  showCategory?: boolean;
}

export function ArkheBundleTable({
  module = "arkhe",
  maxRows,
  showCategory = false,
}: ArkheBundleTableProps): React.ReactElement {
  const data = bundleData as BundleData;
  const moduleData = data.modules[module];
  const libraries = moduleData.libraries;

  const getResult = (utilName: string, library: string): BundleResult | undefined => {
    return moduleData.results.find(
      (r) => r.utilName === utilName && r.library === library
    );
  };

  const getPithosResult = (utilName: string): BundleResult | undefined => {
    return getResult(utilName, "pithos");
  };

  const getBadgeClass = (result: BundleResult | undefined, pithosResult: BundleResult | undefined): string => {
    if (!result?.gzipBytes || !pithosResult?.gzipBytes) return "";
    
    const diff = result.gzipBytes - pithosResult.gzipBytes;
    
    if (diff === 0) return styles.equalBadge;
    if (diff < 0) return styles.smallerBadge;
    return styles.largerBadge;
  };

  const getDiffText = (result: BundleResult | undefined, pithosResult: BundleResult | undefined): string => {
    if (!result?.gzipBytes || !pithosResult?.gzipBytes) return "";
    
    const diff = result.gzipBytes - pithosResult.gzipBytes;
    const percent = Math.round((diff / pithosResult.gzipBytes) * 100);
    
    if (diff === 0) return "=";
    if (percent > 0) return `+${percent}%`;
    return `${percent}%`;
  };

  const utils = maxRows ? moduleData.topUtils.slice(0, maxRows) : moduleData.topUtils;

  // Get version for a library key
  const getVersion = (library: string): string => {
    // Handle special case for es-toolkit/compat
    const versionKey = library === "es-toolkit/compat" ? "es-toolkit" : library;
    return data.versions[versionKey] || "";
  };

  const columns: Column<string>[] = [
    {
      key: "util",
      header: "Utility",
      sticky: true,
      width: "100px",
      minWidth: "100px",
      render: (utilName) => {
        const pithosResult = getPithosResult(utilName);
        return (
          <div>
            <strong>{utilName}</strong>
            {showCategory && pithosResult && (
              <>
                <br />
                <small className={styles.category}>{pithosResult.category}</small>
              </>
            )}
          </div>
        );
      },
    },
    ...libraries.map((library, index) => {
      const displayName = libraryNames[library] || library;
      const version = getVersion(library);
      return {
        key: library,
        header: (
          <>
            {displayName}
            {version && <span className={styles.versionBadge}>v{version}</span>}
          </>
        ),
        className: styles.sizeCell,
        sticky: library === "pithos",
        width: library === "pithos" ? "100px" : undefined,
        minWidth: library === "pithos" ? "100px" : undefined,
        render: (utilName: string) => {
        const result = getResult(utilName, library);
        const pithosResult = getPithosResult(utilName);
        
        if (!result || result.gzipBytes === null) {
          return <span className={styles.na}>-</span>;
        }

        const isPithos = library === "pithos";
        const diffText = !isPithos ? getDiffText(result, pithosResult) : "";
        const badgeClass = !isPithos ? getBadgeClass(result, pithosResult) : "";

        return (
          <>
            <span className={styles.size}>{formatBytes(result.gzipBytes)}</span>
            {isPithos && (
              <>
                <br />
                <span className={`${styles.badge} ${styles.baselineBadge}`}>baseline</span>
              </>
            )}
            {!isPithos && diffText && (
              <>
                <br />
                <span className={`${styles.badge} ${badgeClass}`}>{diffText}</span>
              </>
            )}
          </>
        );
      },
    };}),
  ];

  return (
    <Table
      columns={columns}
      data={utils}
      keyExtractor={(util) => util}
      stickyHeaderOffset={100}
      footer={
        <>
          Data generated on {formatDate(data.generatedAt)} • gzip sizes • esbuild --minify
        </>
      }
    />
  );
}

export function GeneratedDate(): React.ReactElement {
  const data = bundleData as BundleData;
  return <span>{formatDate(data.generatedAt)}</span>;
}

export function VersionInfo(): React.ReactElement {
  const data = bundleData as BundleData;
  return (
    <span>
      Pithos v{data.versions.pithos} • Lodash v{data.versions.lodash} • 
      es-toolkit v{data.versions["es-toolkit"]} • Remeda v{data.versions.remeda} • 
      Radashi v{data.versions.radashi}
    </span>
  );
}

interface TLDRProps {
  module?: "arkhe" | "taphos";
}

export function TLDR({ module = "arkhe" }: TLDRProps): React.ReactElement {
  const data = bundleData as BundleData;
  const moduleData = data.modules[module];
  
  // Calculate stats
  let pithosSmallest = 0;
  let pithosComparable = 0;
  let total = 0;
  
  for (const utilName of moduleData.topUtils) {
    const pithosResult = moduleData.results.find(
      (r) => r.utilName === utilName && r.library === "pithos"
    );
    if (!pithosResult?.gzipBytes) continue;
    
    const otherResults = moduleData.results.filter(
      (r) => r.utilName === utilName && r.library !== "pithos" && r.gzipBytes !== null
    );
    
    if (otherResults.length === 0) continue;
    total++;
    
    const smallestOther = Math.min(...otherResults.map((r) => r.gzipBytes!));
    
    if (pithosResult.gzipBytes <= smallestOther) {
      pithosSmallest++;
    } else if (pithosResult.gzipBytes <= smallestOther * 1.1) {
      pithosComparable++;
    }
  }
  
  const pithosWinRate = Math.round((pithosSmallest / total) * 100);
  const comparableRate = Math.round(((pithosSmallest + pithosComparable) / total) * 100);
  
  return (
    <p className={styles.tldr}>
      Pithos is <strong>smallest or equal in {pithosWinRate}%</strong> of utilities, 
      and <strong>within 10% in {comparableRate}%</strong> of cases. 
      Always smaller than Lodash. Competitive with es-toolkit and Radashi.
    </p>
  );
}

export function Legend(): React.ReactElement {
  const legendRef = React.useRef<HTMLDivElement>(null);
  const [isTableVisible, setIsTableVisible] = React.useState(true);

  React.useEffect(() => {
    const legend = legendRef.current;
    if (!legend) return;

    // Find the table container (next sibling's table wrapper)
    const findTableContainer = (): HTMLElement | null => {
      let sibling = legend.nextElementSibling;
      while (sibling) {
        const table = sibling.querySelector('.tableContainer, table');
        if (table) return sibling as HTMLElement;
        sibling = sibling.nextElementSibling;
      }
      return null;
    };

    const tableContainer = findTableContainer();
    if (!tableContainer) return;

    const checkVisibility = () => {
      const rect = tableContainer.getBoundingClientRect();
      // Hide legend when table bottom is above the navbar (60px)
      setIsTableVisible(rect.bottom > 60);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

  return (
    <div 
      ref={legendRef}
      className={`${styles.legend} ${!isTableVisible ? styles.legendHidden : ""}`}
    >
      <span className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.baselineColor}`}></span>
        Pithos (baseline)
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.smallerColor}`}></span>
        Smaller than Pithos
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.equalColor}`}></span>
        Exactly equal
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.largerColor}`}></span>
        Larger than Pithos
      </span>
    </div>
  );
}

interface StickyLegendProps {
  children: React.ReactNode;
}

export function StickyLegend({ children }: StickyLegendProps): React.ReactElement {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const checkVisibility = () => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;
      
      const rect = sentinel.getBoundingClientRect();
      // Hide when sentinel is above the navbar (60px)
      setIsVisible(rect.bottom > 60);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

  return (
    <div>
      <div className={`${styles.legend} ${isVisible ? "" : styles.legendHidden}`}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.baselineColor}`}></span>
          Pithos (baseline)
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.smallerColor}`}></span>
          Smaller than Pithos
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.equalColor}`}></span>
          Exactly equal
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.largerColor}`}></span>
          Larger than Pithos
        </span>
      </div>
      {children}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}

export default ArkheBundleTable;
