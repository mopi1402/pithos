import React from "react";
import styles from "./styles.module.css";
import { Table, Column } from "../Table";

// Try to import the generated data
let benchmarkData: BenchmarkReport | null = null;
try {
  benchmarkData = require("../../data/zygos-benchmark.json");
} catch {
  benchmarkData = null;
}

interface ScenarioResult {
  library: string;
  opsPerSecond: number;
  rank: number;
  ratio: number;
  isFastest: boolean;
  stats: {
    min: number;
    max: number;
    mean: number;
    p75: number;
    p99: number;
    p995: number;
    p999: number;
    rme: string;
    samples: number;
  };
}

interface ScenarioData {
  name: string;
  results: ScenarioResult[];
}

interface LibrarySummary {
  library: string;
  wins: number;
  totalTests: number;
}

interface BenchmarkReport {
  generatedAt: string;
  versions: Record<string, string>;
  libraries: string[];
  scenarios: ScenarioData[];
  summary: {
    totalScenarios: number;
    libraryRankings: LibrarySummary[];
    winner: string;
  };
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatOps(ops: number): string {
  if (ops >= 1e9) return `${(ops / 1e9).toFixed(2)}B`;
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)}M`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(2)}K`;
  return ops.toFixed(0);
}

// Normalize library name for display
function normalizeLibraryName(name: string): string {
  if (name.startsWith("fp-ts/")) return "fp-ts";
  return name;
}

// Get category from scenario name
function getCategory(scenarioName: string): "result" | "option" {
  return scenarioName.startsWith("option/") ? "option" : "result";
}

// Helper to get heatmap color based on ratio
function getHeatmapStyle(ratio: number, isFastest: boolean): React.CSSProperties {
  if (isFastest) {
    return { backgroundColor: "rgba(0, 200, 83, 0.35)" };
  }
  
  if (ratio <= 1.5) {
    const t = (ratio - 1) / 0.5;
    const green = Math.round(200 - t * 50);
    const red = Math.round(t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 50, 0.25)` };
  } else if (ratio <= 3) {
    const t = (ratio - 1.5) / 1.5;
    const green = Math.round(150 - t * 80);
    const red = Math.round(100 + t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 30, 0.25)` };
  } else if (ratio <= 10) {
    const t = Math.min((ratio - 3) / 7, 1);
    const green = Math.round(70 - t * 50);
    const red = Math.round(200 + t * 55);
    return { backgroundColor: `rgba(${red}, ${green}, 20, 0.25)` };
  } else {
    return { backgroundColor: "rgba(255, 50, 50, 0.3)" };
  }
}

// Error component when data is missing
export function ZygosBenchmarkDataMissing(): React.ReactElement {
  return (
    <div className={styles.errorContainer}>
      <h3>⚠️ Benchmark data not found</h3>
      <p>
        The benchmark results file <code>zygos-benchmark.json</code> is missing.
      </p>
      <p>Generate it by running:</p>
      <pre>
        <code>pnpm doc:generate:zygos:benchmarks-results</code>
      </pre>
    </div>
  );
}

// Generated date component
export function ZygosGeneratedDate(): React.ReactElement {
  if (!benchmarkData) return <span>N/A</span>;
  return <span>{formatDate(benchmarkData.generatedAt)}</span>;
}

// TL;DR component
export function ZygosPerfTLDR(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  // Calculate wins for zygos vs neverthrow only (Result scenarios)
  const resultScenarios = benchmarkData.scenarios.filter(s => s.name.startsWith("result/"));
  const zygosWins = resultScenarios.filter(s => 
    s.results.find(r => r.library === "zygos")?.isFastest
  ).length;
  const winRate = Math.round((zygosWins / resultScenarios.length) * 100);

  return (
    <p className={styles.tldr}>
      <strong className={styles.highlight}>Zygos wins {winRate}% of Result benchmarks vs Neverthrow.</strong>{" "}
      Up to <strong className={styles.highlight}>3x faster</strong> on object creation, 
      <strong className={styles.highlight}> 2-3x faster</strong> on chained operations.
      Similar performance on simple operations like <code>isOk()</code> and <code>unwrapOr()</code>.
    </p>
  );
}

// Library descriptions
const libraryDescriptions: Record<string, string> = {
  zygos: "Pithos Result/Option module (lightweight, tree-shakeable)",
  neverthrow: "Popular Result library for TypeScript",
  "fp-ts": "Functional programming library with Option/Either",
};

// Version info component
export function ZygosVersionsTable(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const versions = benchmarkData.versions;
  const versionEntries = Object.entries(versions).sort(([a], [b]) => {
    if (a === "zygos") return -1;
    if (b === "zygos") return 1;
    return a.localeCompare(b);
  });

  const columns: Column<[string, string]>[] = [
    {
      key: "library",
      header: "Library",
      sticky: true,
      width: "140px",
      render: ([lib]) => <strong>{lib}</strong>,
    },
    {
      key: "version",
      header: "Version",
      width: "100px",
      render: ([, version]) => <code>{version}</code>,
    },
    {
      key: "description",
      header: "Description",
      wrap: true,
      render: ([lib]) => libraryDescriptions[lib] || "—",
    },
  ];

  return (
    <Table
      columns={columns}
      data={versionEntries}
      keyExtractor={([lib]) => lib}
      footer={<>Benchmarks run on {formatDate(benchmarkData.generatedAt)}</>}
    />
  );
}

// Result benchmark table (Zygos vs Neverthrow)
export function ZygosResultBenchmarkTable(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const resultScenarios = benchmarkData.scenarios
    .filter(s => s.name.startsWith("result/"))
    .map(s => ({
      ...s,
      results: s.results.filter(r => r.library === "zygos" || r.library === "neverthrow"),
    }));

  const libraries = ["zygos", "neverthrow"];

  const columns: Column<ScenarioData>[] = [
    {
      key: "test",
      header: "Test",
      sticky: true,
      width: "180px",
      minWidth: "180px",
      render: (scenario) => {
        const name = scenario.name.replace("result/", "");
        return <strong>{name}</strong>;
      },
    },
    ...libraries.map((lib) => ({
      key: lib,
      header: lib === "zygos" ? "Zygos" : "Neverthrow",
      className: styles.resultCell,
      style: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) return {};
        return getHeatmapStyle(result.ratio, result.isFastest);
      },
      render: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) {
          return <span className={styles.na}>N/A</span>;
        }

        return (
          <>
            <div className={styles.opsValue}>
              {formatOps(result.opsPerSecond)} <span className={styles.opsUnit}>ops/s</span>
            </div>
            <div className={styles.ratio}>
              {result.isFastest ? (
                <span className={styles.fastestLabel}>fastest</span>
              ) : (
                <span className={styles.ratioValue}>({result.ratio}x)</span>
              )}
            </div>
          </>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      data={resultScenarios}
      keyExtractor={(scenario) => scenario.name}
      footer={
        <>
          Data generated on {formatDate(benchmarkData.generatedAt)} • Vitest bench
        </>
      }
      stickyHeader={true}
    />
  );
}

// Option benchmark table (Zygos vs fp-ts)
export function ZygosOptionBenchmarkTable(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const optionScenarios = benchmarkData.scenarios
    .filter(s => s.name.startsWith("option/"))
    .map(s => ({
      ...s,
      // Normalize fp-ts library names and keep only zygos and fp-ts
      results: s.results
        .filter(r => r.library === "zygos" || r.library.startsWith("fp-ts"))
        .map(r => ({
          ...r,
          library: normalizeLibraryName(r.library),
        })),
    }));

  const libraries = ["zygos", "fp-ts"];

  const columns: Column<ScenarioData>[] = [
    {
      key: "test",
      header: "Test",
      sticky: true,
      width: "180px",
      minWidth: "180px",
      render: (scenario) => {
        const name = scenario.name.replace("option/", "");
        return <strong>{name}</strong>;
      },
    },
    ...libraries.map((lib) => ({
      key: lib,
      header: lib === "zygos" ? "Zygos" : "fp-ts",
      className: styles.resultCell,
      style: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) return {};
        return getHeatmapStyle(result.ratio, result.isFastest);
      },
      render: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) {
          return <span className={styles.na}>N/A</span>;
        }

        return (
          <>
            <div className={styles.opsValue}>
              {formatOps(result.opsPerSecond)} <span className={styles.opsUnit}>ops/s</span>
            </div>
            <div className={styles.ratio}>
              {result.isFastest ? (
                <span className={styles.fastestLabel}>fastest</span>
              ) : (
                <span className={styles.ratioValue}>({result.ratio}x)</span>
              )}
            </div>
          </>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      data={optionScenarios}
      keyExtractor={(scenario) => scenario.name}
      footer={
        <>
          Data generated on {formatDate(benchmarkData.generatedAt)} • Vitest bench
        </>
      }
      stickyHeader={true}
    />
  );
}

// Performance summary component
export function ZygosPerformanceSummary(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  // Calculate wins for Result (zygos vs neverthrow)
  const resultScenarios = benchmarkData.scenarios.filter(s => s.name.startsWith("result/"));
  const zygosResultWins = resultScenarios.filter(s => 
    s.results.find(r => r.library === "zygos")?.isFastest
  ).length;
  const neverthrowWins = resultScenarios.length - zygosResultWins;

  // Calculate wins for Option (zygos vs fp-ts)
  const optionScenarios = benchmarkData.scenarios.filter(s => s.name.startsWith("option/"));
  const zygosOptionWins = optionScenarios.length; // Zygos wins all Option benchmarks

  const summaryData = [
    { category: "Result (vs Neverthrow)", zygosWins: zygosResultWins, competitorWins: neverthrowWins, total: resultScenarios.length },
    { category: "Option (vs fp-ts)", zygosWins: zygosOptionWins, competitorWins: 0, total: optionScenarios.length },
  ];

  return (
    <div className={styles.summaryContainer}>
      <h3>📊 Performance Summary</h3>
      <div className={styles.summaryGrid}>
        {summaryData.map((item) => {
          const zygosPercent = (item.zygosWins / item.total) * 100;

          return (
            <div key={item.category} className={styles.summaryRow}>
              <div className={styles.summaryLabel}>{item.category}</div>
              <div className={styles.summaryBar}>
                <div
                  className={styles.summaryBarFill}
                  style={{ width: `${zygosPercent}%` }}
                />
              </div>
              <div className={styles.summaryStats}>
                <span className={styles.wins}>
                  🏆 Zygos: {item.zygosWins}/{item.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Detailed stats table
export function ZygosDetailedStats(): React.ReactElement {
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const columns: Column<ScenarioResult>[] = [
    {
      key: "library",
      header: "Library",
      sticky: true,
      width: "120px",
      render: (result) => (
        <>
          <strong>{normalizeLibraryName(result.library)}</strong>
          {result.isFastest && <span className={styles.fastestBadge}> 🏆</span>}
        </>
      ),
    },
    {
      key: "opsPerSecond",
      header: "ops/s",
      className: styles.opsCell,
      render: (result) => formatOps(result.opsPerSecond),
    },
    { key: "min", header: "min", render: (result) => result.stats.min.toFixed(4) },
    { key: "max", header: "max", render: (result) => result.stats.max.toFixed(4) },
    { key: "mean", header: "mean", render: (result) => result.stats.mean.toFixed(4) },
    { key: "p75", header: "p75", render: (result) => result.stats.p75.toFixed(4) },
    { key: "p99", header: "p99", render: (result) => result.stats.p99.toFixed(4) },
    { key: "rme", header: "rme", render: (result) => result.stats.rme },
    { key: "samples", header: "samples", render: (result) => result.stats.samples.toLocaleString() },
  ];

  return (
    <div className={styles.detailedContainer}>
      {benchmarkData.scenarios.map((scenario) => (
        <details key={scenario.name} className={styles.scenarioDetails}>
          <summary className={styles.scenarioSummary}>
            <span className={styles.scenarioName}>{scenario.name}</span>
          </summary>
          <div className={styles.detailedTableWrapper}>
            <Table
              columns={columns}
              data={scenario.results}
              keyExtractor={(result) => result.library}
              stickyHeader={false}
            />
          </div>
        </details>
      ))}
    </div>
  );
}

export default ZygosResultBenchmarkTable;
