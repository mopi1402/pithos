import React from "react";
import { translate } from "@docusaurus/Translate";
import styles from "@site/src/components/comparisons/BundleSizeTable/styles.module.css";
import { Table, Column } from "@site/src/components/shared/Table";
import { formatBytes, formatDate } from "@site/src/utils/format";
import { variantNames, moduleNames } from "@site/src/data/comparisons/zygos-bundle-config";
import type { BundleResult, BundleData } from "./types";

import bundleData from "@site/src/data/comparisons/zygos-bundle-sizes.json";

function getResult(
  data: BundleData,
  variant: string,
  module: string,
  category: string
): BundleResult | undefined {
  return data.results.find(
    (r) => r.variant === variant && r.module === module && r.category === category
  );
}

function getDiffPercent(result: BundleResult, base: BundleResult): string {
  const diff = result.gzipBytes - base.gzipBytes;
  const percent = ((diff / base.gzipBytes) * 100).toFixed(0);
  if (diff > 0) return `+${percent}%`;
  if (diff < 0) return `${percent}%`;
  return "0%";
}

function getRatio(result: BundleResult, base: BundleResult): string {
  const ratio = result.gzipBytes / base.gzipBytes;
  return `${ratio.toFixed(1)}x`;
}

interface ComparisonTableProps {
  modules: string[];
  category: string;
  variants: string[];
  baseVariant?: string;
}

function ComparisonTable({
  modules,
  category,
  variants,
  baseVariant = "zygos",
}: ComparisonTableProps): React.ReactElement {
  const data = bundleData as BundleData;

  const columns: Column<string>[] = [
    {
      key: "module",
      header: translate({ id: 'comparison.bundle.zygos.header.module', message: 'Module' }),
      sticky: true,
      width: "160px",
      minWidth: "160px",
      render: (mod) => (
        <div style={{ whiteSpace: "normal" }}>
          <strong>{moduleNames[mod] || mod}</strong>
          {(() => {
            const result = getResult(data, "zygos", mod, category);
            return result ? (
              <>
                <br />
                <small className={styles.description}>{result.description}</small>
              </>
            ) : null;
          })()}
        </div>
      ),
    },
    ...variants.map((variant) => ({
      key: variant,
      header: variantNames[variant] || variant,
      className: (mod: string) => {
        const result = getResult(data, variant, mod, category);
        if (!result) return styles.naCell;

        const base = getResult(data, baseVariant, mod, category);
        const isBase = variant === baseVariant;
        const isSmaller = base && result.gzipBytes < base.gzipBytes;

        return `${styles.sizeCell} ${isSmaller ? styles.smaller : ""} ${isBase ? styles.base : ""}`;
      },
      render: (mod: string) => {
        const result = getResult(data, variant, mod, category);

        if (!result) {
          return <span className={styles.naCell}>
            {translate({ id: 'comparison.common.na', message: 'N/A' })}
          </span>;
        }

        const base = getResult(data, baseVariant, mod, category);
        const isBase = variant === baseVariant;

        return (
          <>
            <span className={styles.size}>
              {formatBytes(result.gzipBytes)}
            </span>
            {isBase && (
              <>
                <br />
                <span className={`${styles.diff} ${styles.diffBaseline}`}>
                  {translate({ id: 'comparison.common.baseline', message: 'baseline' })}
                </span>
              </>
            )}
            {!isBase && base && (
              <>
                <br />
                <span
                  className={`${styles.diff} ${
                    result.gzipBytes <= base.gzipBytes
                      ? styles.diffSmaller
                      : styles.diffLarger
                  }`}
                >
                  {getDiffPercent(result, base)}
                </span>
              </>
            )}
          </>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      data={modules}
      keyExtractor={(mod) => mod}
      footer={
        translate(
          { id: 'comparison.bundle.zygos.footer', message: 'Data generated on {date} · Measured with esbuild + gzip' },
          { date: formatDate(data.generatedAt) }
        )
      }
    />
  );
}

export function ZygosResultBundleTable(): React.ReactElement {
  return (
    <ComparisonTable
      modules={["result", "result-async", "result-all", "safe"]}
      category="result-pattern"
      variants={["zygos", "neverthrow"]}
    />
  );
}

export function ZygosFpBundleTable(): React.ReactElement {
  return (
    <ComparisonTable
      modules={["option", "either", "task", "task-either"]}
      category="fp-monads"
      variants={["zygos", "fp-ts"]}
    />
  );
}

export function ZygosCombinedBundleTable(): React.ReactElement {
  return (
    <ComparisonTable
      modules={["full-result", "full-fp", "full-library"]}
      category="combined"
      variants={["zygos", "neverthrow", "fp-ts"]}
    />
  );
}

export function ZygosGeneratedDate(): React.ReactElement {
  const data = bundleData as BundleData;
  return <span>{formatDate(data.generatedAt)}</span>;
}

export function ZygosBundleSummary(): React.ReactElement {
  const data = bundleData as BundleData;

  const zygosResult = getResult(data, "zygos", "result-all", "result-pattern");
  const nevResult = getResult(data, "neverthrow", "result-all", "result-pattern");
  const zygosOption = getResult(data, "zygos", "option", "fp-monads");
  const fpTsOption = getResult(data, "fp-ts", "option", "fp-monads");

  const resultRatio = zygosResult && nevResult ? getRatio(nevResult, zygosResult) : "?x";
  const optionRatio = zygosOption && fpTsOption ? getRatio(fpTsOption, zygosOption) : "?x";

  return (
    <div className={styles.tableContainer}>
      <table className={styles.bundleTable}>
        <thead>
          <tr>
            <th>{translate({ id: 'comparison.bundle.zygos.summary.aspect', message: 'Comparison' })}</th>
            <th>{translate({ id: 'comparison.bundle.zygos.summary.zygosSize', message: 'Zygos' })}</th>
            <th>{translate({ id: 'comparison.bundle.zygos.summary.competitor', message: 'Competitor' })}</th>
            <th>{translate({ id: 'comparison.bundle.zygos.summary.savings', message: 'Savings' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>
                {translate({ id: 'comparison.bundle.zygos.summary.vsNeverthrow', message: 'vs Neverthrow' })}
              </strong>
            </td>
            <td className={styles.sizeCell}>
              <span className={styles.size}>
                {zygosResult ? formatBytes(zygosResult.gzipBytes) : "N/A"}
              </span>
            </td>
            <td className={styles.sizeCell}>
              <span className={styles.size}>
                {nevResult ? formatBytes(nevResult.gzipBytes) : "N/A"}
              </span>
            </td>
            <td>
              <span className={`${styles.diff} ${styles.diffSmaller}`}>
                {resultRatio} {translate({ id: 'comparison.bundle.zygos.summary.smaller', message: 'smaller' })}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <strong>
                {translate({ id: 'comparison.bundle.zygos.summary.vsFpTs', message: 'vs fp-ts' })}
              </strong>
              <br />
              <small className={styles.description}>Option</small>
            </td>
            <td className={styles.sizeCell}>
              <span className={styles.size}>
                {zygosOption ? formatBytes(zygosOption.gzipBytes) : "N/A"}
              </span>
            </td>
            <td className={styles.sizeCell}>
              <span className={styles.size}>
                {fpTsOption ? formatBytes(fpTsOption.gzipBytes) : "N/A"}
              </span>
            </td>
            <td>
              <span className={`${styles.diff} ${styles.diffSmaller}`}>
                {optionRatio} {translate({ id: 'comparison.bundle.zygos.summary.smaller', message: 'smaller' })}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ZygosVersionInfo(): React.ReactElement {
  const data = bundleData as BundleData;
  return (
    <p className={styles.generatedAt}>
      {translate(
        { id: 'comparison.bundle.zygos.versionInfo', message: 'Pithos v{pithos} / Neverthrow v{neverthrow} / fp-ts v{fpTs}' },
        {
          pithos: data.versions?.pithos || "?",
          neverthrow: data.versions?.neverthrow || "?",
          fpTs: data.versions?.["fp-ts"] || "?",
        }
      )}
    </p>
  );
}

interface ZygosSizeHighlightProps {
  /**
   * "ratio" → "2.6x smaller"
   * "sizes" → "~0.76 kB vs ~1.96 kB"
   * "full" → "2.6x smaller (~0.76 kB vs ~1.96 kB)"
   * "zygos-size" → "~0.76 kB"
   * "nev-size" → "~1.96 kB"
   */
  type?: "ratio" | "sizes" | "full" | "zygos-size" | "nev-size";
  module?: string;
  category?: string;
}

export function ZygosSizeHighlight({
  type = "full",
  module = "result-all",
  category = "result-pattern",
}: ZygosSizeHighlightProps): React.ReactElement {
  const data = bundleData as BundleData;

  const zygos = getResult(data, "zygos", module, category);
  const nev = getResult(data, "neverthrow", module, category);

  if (!zygos || !nev) {
    return <span>N/A</span>;
  }

  const ratio = getRatio(nev, zygos);
  const zygosSize = formatBytes(zygos.gzipBytes);
  const nevSize = formatBytes(nev.gzipBytes);

  if (type === "ratio") {
    return <span>{ratio} smaller</span>;
  }
  if (type === "zygos-size") {
    return <span>~{zygosSize}</span>;
  }
  if (type === "nev-size") {
    return <span>~{nevSize}</span>;
  }
  if (type === "sizes") {
    return <span>~{zygosSize} vs ~{nevSize}</span>;
  }
  // full
  return <span>{ratio} smaller (~{zygosSize} vs ~{nevSize})</span>;
}
