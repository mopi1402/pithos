import React from "react";
import { translate } from '@docusaurus/Translate';
import styles from "./styles.module.css";
import { Table, Column } from "@site/src/components/shared/Table";
import { formatDate, formatBytes as formatBytesBase } from "@site/src/utils/format";
import { Legend as SharedLegend, StickyLegend as SharedStickyLegend } from "@site/src/components/shared/Legend";
import type { LegendItem } from "@site/src/components/shared/Legend";
import type { BundleResult, BundleData } from "./types";
import { libraryNames } from "@site/src/data/comparisons/arkhe-bundle-config";

// Import the generated data
import bundleData from "@site/src/data/comparisons/arkhe-taphos-bundle-sizes.json";

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "-";
  return formatBytesBase(bytes);
}

const legendItems: LegendItem[] = [
  { colorClass: styles.baselineColor, label: translate({ id: 'comparison.bundle.arkhe.legend.baseline', message: 'Pithos (baseline)' }) },
  { colorClass: styles.smallerColor, label: translate({ id: 'comparison.bundle.arkhe.legend.smaller', message: 'Smaller than Pithos' }) },
  { colorClass: styles.equalColor, label: translate({ id: 'comparison.bundle.arkhe.legend.equal', message: 'Exactly equal' }) },
  { colorClass: styles.largerColor, label: translate({ id: 'comparison.bundle.arkhe.legend.larger', message: 'Larger than Pithos' }) },
];

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
      header: translate({ id: 'comparison.bundle.arkhe.header.utility', message: 'Utility' }),
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
    ...libraries.map((library) => {
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
                <span className={`${styles.badge} ${styles.baselineBadge}`}>{translate({ id: 'comparison.common.baseline', message: 'baseline' })}</span>
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
      stickyHeaderOffset={106.5}
      footer={
        <>
          {translate(
            { id: 'comparison.bundle.footer.gzipEsbuild', message: 'Data generated on {date} • gzip sizes • esbuild --minify' },
            { date: formatDate(data.generatedAt) }
          )}
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
      {translate(
        { id: 'comparison.bundle.arkhe.tldr.text', message: 'Pithos is' }
      )} <strong>{translate(
        { id: 'comparison.bundle.arkhe.tldr.highlight', message: 'smallest or comparable (±10%) in {comparableRate}% of utilities' },
        { comparableRate: String(comparableRate) }
      )}</strong>{translate(
        { id: 'comparison.bundle.arkhe.tldr.after', message: '. Always smaller than Lodash. Competitive with es-toolkit and Radashi.' }
      )}
    </p>
  );
}

export function Legend(): React.ReactElement {
  return <SharedLegend items={legendItems} />;
}

interface StickyLegendProps {
  children: React.ReactNode;
}

export function StickyLegend({ children }: StickyLegendProps): React.ReactElement {
  return <SharedStickyLegend items={legendItems}>{children}</SharedStickyLegend>;
}

export default ArkheBundleTable;
