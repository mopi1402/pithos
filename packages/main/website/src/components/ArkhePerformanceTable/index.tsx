import React from "react";
import styles from "./styles.module.css";
import { Table, Column } from "../Table";

// Try to import the generated data
let benchmarkData: BenchmarkReport | null = null;
try {
  benchmarkData = require("../../data/arkhe-benchmark.json");
} catch {
  benchmarkData = null;
}

// Import function weights
import functionWeights from "../../data/function-weights.json";

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const categoryConfig = functionWeights.categories as Record<CategoryName, { weight: number; description: string; color: string }>;
const arkheWeights = functionWeights.modules.arkhe as Record<string, { category: CategoryName; reason: string }>;

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

interface WeightedLibrarySummary {
  library: string;
  weightedScore: number;
  wins: number;
  winsByCategory: Record<CategoryName, number>;
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

// Extract utility name from scenario name (e.g., "chunk\nlargeArray" -> "chunk")
function getUtilityName(scenarioName: string): string {
  const parts = scenarioName.split('\n');
  return parts[0].trim();
}

// Get weight info for a scenario
function getScenarioWeight(scenarioName: string): { category: CategoryName; weight: number; reason: string } | null {
  const utilName = getUtilityName(scenarioName);
  const weightInfo = arkheWeights[utilName];
  if (!weightInfo) return null;
  return {
    category: weightInfo.category,
    weight: categoryConfig[weightInfo.category].weight,
    reason: weightInfo.reason,
  };
}

// Category badge colors
const categoryColors: Record<CategoryName, string> = {
  CRITICAL: styles.categoryCritical,
  HIGH: styles.categoryHigh,
  MEDIUM: styles.categoryMedium,
  LOW: styles.categoryLow,
};

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
export function ArkheBenchmarkDataMissing(): React.ReactElement {
  return (
    <div className={styles.errorContainer}>
      <h3>⚠️ Benchmark data not found</h3>
      <p>
        The benchmark results file <code>arkhe-benchmark.json</code> is missing.
      </p>
      <p>Generate it by running:</p>
      <pre>
        <code>pnpm doc:generate:arkhe:benchmarks-results</code>
      </pre>
    </div>
  );
}

// Generated date component
export function ArkheGeneratedDate(): React.ReactElement {
  if (!benchmarkData) return <span>N/A</span>;
  return <span>{formatDate(benchmarkData.generatedAt)}</span>;
}

// TL;DR component
export function ArkhePerfTLDR(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const { summary } = benchmarkData;
  const winRate = Math.round((summary.libraryRankings.find(r => r.library === "arkhe")?.wins || 0) / summary.totalScenarios * 100);

  return (
    <p className={styles.tldr}>
      <strong>Arkhe wins ~{winRate}% of benchmarks.</strong> Fastest for typical use cases (small to medium arrays). 
      Lodash can be faster on very large arrays (10K+ items) due to different algorithmic trade-offs.
    </p>
  );
}

// Library descriptions (lodash CommonJS excluded, we only use lodash-es)
const libraryDescriptions: Record<string, string> = {
  arkhe: "Pithos utility module (modern ES2020+)",
  "es-toolkit": "Modern utility library, tree-shakeable",
  "es-toolkit/compat": "es-toolkit with lodash compatibility",
  "lodash-es": "ES modules version of lodash",
};

// Filter out lodash CommonJS from libraries list
const excludedLibraries = ["lodash"];

// Version info component
export function ArkheVersionsTable(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const versions = benchmarkData.versions;
  const versionEntries = Object.entries(versions)
    .filter(([lib]) => !excludedLibraries.includes(lib))
    .sort(([a], [b]) => {
      if (a === "arkhe") return -1;
      if (b === "arkhe") return 1;
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


// Main benchmark results table with heatmap
export function ArkheBenchmarkResultsTable(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const { scenarios, libraries } = benchmarkData;

  // Sort libraries: arkhe first, then alphabetically
  // Filter out excluded libraries (lodash CommonJS)
  const sortedLibraries = [...libraries]
    .filter(lib => !excludedLibraries.includes(lib))
    .sort((a, b) => {
      if (a === "arkhe") return -1;
      if (b === "arkhe") return 1;
      return a.localeCompare(b);
    });

  const columns: Column<ScenarioData>[] = [
    {
      key: "test",
      header: "Test",
      sticky: true,
      width: "180px",
      minWidth: "180px",
      wrap: true,
      render: (scenario) => {
        const parts = scenario.name.split('\n');
        const utilityName = parts[0];
        const detail = parts[1] || null;
        const weightInfo = getScenarioWeight(scenario.name);
        return (
          <div className={styles.testName}>
            {utilityName}
            {detail && <div className={styles.testNameDetail}>{detail}</div>}
            {weightInfo && (
              <div className={styles.testMeta}>
                <span 
                  className={`${styles.categoryBadge} ${categoryColors[weightInfo.category]}`}
                  title={weightInfo.reason}
                >
                  {weightInfo.category} | {weightInfo.weight} pts
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    ...sortedLibraries.map((lib) => ({
      key: lib,
      header: lib,
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
      data={scenarios}
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
export function ArkhePerformanceSummary(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const { summary } = benchmarkData;
  const totalScenarios = summary.totalScenarios;

  // Filter out excluded libraries from rankings
  const filteredRankings = summary.libraryRankings.filter(
    ranking => !excludedLibraries.includes(ranking.library)
  );

  return (
    <div className={styles.summaryContainer}>
      <h3>📊 Performance Summary</h3>
      <div className={styles.summaryGrid}>
        {filteredRankings.map((ranking, index) => {
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
          const barWidth = (ranking.wins / totalScenarios) * 100;

          return (
            <div key={ranking.library} className={styles.rankingRow}>
              <div className={styles.rankingLabel}>
                <span className={styles.medal}>{medal}</span>
                <span className={styles.libName}>{ranking.library}</span>
              </div>
              <div className={styles.rankingBar}>
                <div
                  className={styles.rankingBarFill}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={styles.rankingStats}>
                <span className={styles.wins}>{ranking.wins} wins</span>
                <span className={styles.percentage}>
                  ({((ranking.wins / totalScenarios) * 100).toFixed(0)}%)
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
export function ArkheDetailedStats(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const columns: Column<ScenarioResult>[] = [
    {
      key: "library",
      header: "Library",
      sticky: true,
      width: "120px",
      render: (result) => (
        <>
          <strong>{result.library}</strong>
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
      {benchmarkData.scenarios.map((scenario) => {
        // Filter out excluded libraries from results
        const filteredResults = scenario.results.filter(
          result => !excludedLibraries.includes(result.library)
        );
        
        return (
          <details key={scenario.name} className={styles.scenarioDetails}>
            <summary className={styles.scenarioSummary}>
              <span className={styles.scenarioName}>{scenario.name}</span>
            </summary>
            <div className={styles.detailedTableWrapper}>
              <Table
                columns={columns}
                data={filteredResults}
                keyExtractor={(result) => result.library}
                stickyHeader={false}
              />
            </div>
          </details>
        );
      })}
    </div>
  );
}

// Weighted performance summary component
export function ArkheWeightedSummary(): React.ReactElement {
  if (!benchmarkData) return <ArkheBenchmarkDataMissing />;

  const { scenarios, libraries } = benchmarkData;

  // Calculate weighted scores for each library
  const weightedScores: WeightedLibrarySummary[] = libraries
    .filter(lib => !excludedLibraries.includes(lib))
    .map(lib => {
      let weightedScore = 0;
      let wins = 0;
      const winsByCategory: Record<CategoryName, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

      for (const scenario of scenarios) {
        const result = scenario.results.find(r => r.library === lib);
        if (!result?.isFastest) continue;

        wins++;
        const weightInfo = getScenarioWeight(scenario.name);
        if (weightInfo) {
          weightedScore += weightInfo.weight;
          winsByCategory[weightInfo.category]++;
        }
      }

      return { library: lib, weightedScore, wins, winsByCategory };
    })
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const totalWeightedScore = weightedScores.reduce((sum, r) => sum + r.weightedScore, 0);
  const winner = weightedScores[0];

  // Calculate max possible score
  const maxPossibleScore = scenarios.reduce((sum, scenario) => {
    const weightInfo = getScenarioWeight(scenario.name);
    return sum + (weightInfo?.weight || 0);
  }, 0);

  return (
    <div className={styles.weightedContainer}>
      <h3>📈 Weighted Performance Summary</h3>
      <p className={styles.weightedExplanation}>
        Scores weighted by real-world importance: CRITICAL functions (5 pts) matter more than LOW priority ones (0.5 pts).
      </p>
      {winner && winner.weightedScore > 0 && (
        <p className={styles.winnerAnnouncement}>
          🏆 <strong>{winner.library}</strong> leads with {winner.weightedScore.toFixed(1)} pts 
          ({((winner.weightedScore / maxPossibleScore) * 100).toFixed(0)}% of max possible)
        </p>
      )}
      <div className={styles.weightedGrid}>
        {weightedScores.map((ranking, index) => {
          const percentage = totalWeightedScore > 0
            ? ((ranking.weightedScore / totalWeightedScore) * 100).toFixed(0)
            : "0";
          const barWidth = totalWeightedScore > 0
            ? (ranking.weightedScore / totalWeightedScore) * 100
            : 0;

          return (
            <div key={ranking.library} className={styles.weightedRow}>
              <div className={styles.weightedLabel}>
                <span className={styles.medal}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
                </span>
                <span className={styles.libName}>{ranking.library}</span>
              </div>
              <div className={styles.weightedBar}>
                <div
                  className={`${styles.weightedBarFill} ${index === 0 ? styles.winner : ""}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={styles.weightedStats}>
                <span className={styles.weightedPercentage}>{percentage}%</span>
                <span className={styles.points}>({ranking.weightedScore.toFixed(1)} pts)</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.categoryBreakdown}>
        <h4>Wins by Category</h4>
        <div className={styles.categoryGrid}>
          {weightedScores.slice(0, 4).map(ranking => (
            <div key={ranking.library} className={styles.categoryRow}>
              <span className={styles.categoryLibName}>{ranking.library}</span>
              <span className={`${styles.categoryCount} ${styles.categoryCritical}`}>
                {ranking.winsByCategory.CRITICAL} CRITICAL
              </span>
              <span className={`${styles.categoryCount} ${styles.categoryHigh}`}>
                {ranking.winsByCategory.HIGH} HIGH
              </span>
              <span className={`${styles.categoryCount} ${styles.categoryMedium}`}>
                {ranking.winsByCategory.MEDIUM} MEDIUM
              </span>
              <span className={`${styles.categoryCount} ${styles.categoryLow}`}>
                {ranking.winsByCategory.LOW} LOW
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
