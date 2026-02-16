import React, { useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { DashedSeparator } from "@site/src/components/shared/DashedSeparator";
import {
  GeneratedDate as GenericGeneratedDate,
  PerfTLDR as GenericPerfTLDR,
  VersionsTable as GenericVersionsTable,
  BenchmarkResultsTable as GenericBenchmarkResultsTable,
  PerformanceSummary as GenericPerformanceSummary,
  DetailedStats as GenericDetailedStats,
  WeightedSummary as GenericWeightedSummary,
  LibraryFilterProvider,
  LibraryFilterToggle,
  useLibraryFilter,
} from "@site/src/components/comparisons/BenchmarkTable";
import type {
  ScenarioData,
  ScenarioResult,
} from "@site/src/components/comparisons/BenchmarkTable";
import { RankingChart, type RankingItem } from "@site/src/components/shared/RankingChart";
import { Table, type Column } from "@site/src/components/shared/Table";
import { formatOps } from "@site/src/utils/format";
import { kanonConfig } from "./config";
import styles from "./styles.module.css";
import sharedStyles from "@site/src/components/comparisons/BenchmarkTable/styles.module.css";

// ============================================
// Re-export library groups for backward compatibility
// ============================================

export const LIBRARY_GROUPS = kanonConfig.libraryFilter!.groups;
export type LibraryGroup = keyof typeof LIBRARY_GROUPS;

// ============================================
// Error component
// ============================================

export function BenchmarkDataMissing(): React.ReactElement {
  return (
    <div className={sharedStyles.errorContainer}>
      <h3>{translate({ id: 'comparison.kanon.error.title', message: '⚠️ Benchmark data not found' })}</h3>
      <p>
        {translate({ id: 'comparison.kanon.error.missing', message: 'The benchmark results file kanon-benchmark-realworld.json is missing.' })}
      </p>
      <p>{translate({ id: 'comparison.kanon.error.generate', message: 'Generate it by running:' })}</p>
      <pre>
        <code>{kanonConfig.generateCommand}</code>
      </pre>
    </div>
  );
}

// ============================================
// Thin wrapper components (delegate to generic BenchmarkTable with kanonConfig)
// ============================================

export const KanonGeneratedDate = () => <GenericGeneratedDate config={kanonConfig} />;
export const KanonPerfTLDR = () => <GenericPerfTLDR config={kanonConfig} />;
export const KanonVersionsTable = () => <GenericVersionsTable config={kanonConfig} />;
export const KanonBenchmarkResultsTable = () => <GenericBenchmarkResultsTable config={kanonConfig} />;
export const KanonPerformanceSummary = () => <GenericPerformanceSummary config={kanonConfig} />;
export const KanonDetailedStats = () => <GenericDetailedStats config={kanonConfig} />;
export const KanonWeightedSummary = () => <GenericWeightedSummary config={kanonConfig} />;

// ============================================
// Filter-aware inner components for FilterableBenchmarkSection
// ============================================

interface LibrarySummaryLocal {
  library: string;
  wins: number;
  weightedScore: number;
}

function calculateFilteredSummary(
  scenarios: ScenarioData[],
  visibleLibraries: string[],
): { rankings: LibrarySummaryLocal[]; winner: string | null; totalScenarios: number } {
  const winsMap = new Map<string, number>();
  const scoreMap = new Map<string, number>();

  for (const lib of visibleLibraries) {
    winsMap.set(lib, 0);
    scoreMap.set(lib, 0);
  }

  for (const scenario of scenarios) {
    const visibleResults = scenario.results
      .filter((r) => visibleLibraries.includes(r.library))
      .sort((a, b) => b.opsPerSecond - a.opsPerSecond);

    if (visibleResults.length > 0) {
      const fastest = visibleResults[0];
      winsMap.set(fastest.library, (winsMap.get(fastest.library) || 0) + 1);
      scoreMap.set(fastest.library, (scoreMap.get(fastest.library) || 0) + (scenario.weight ?? 1));
    }
  }

  const rankings: LibrarySummaryLocal[] = visibleLibraries
    .map((lib) => ({
      library: lib,
      wins: winsMap.get(lib) || 0,
      weightedScore: scoreMap.get(lib) || 0,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore || b.wins - a.wins);

  const winner = rankings.length > 0 && rankings[0].wins > 0 ? rankings[0].library : null;

  return { rankings, winner, totalScenarios: scenarios.length };
}

function rankingsToItems(rankings: LibrarySummaryLocal[], total: number): RankingItem[] {
  return rankings.map((r) => ({
    key: r.library,
    label: r.library,
    barPercent: total > 0 ? (r.wins / total) * 100 : 0,
    stats: <span className={sharedStyles.wins}>{r.wins} wins</span>,
  }));
}

function weightedRankingsToItems(rankings: LibrarySummaryLocal[], total: number): RankingItem[] {
  return rankings.map((r, i) => ({
    key: r.library,
    label: r.library,
    barPercent: total > 0 ? (r.weightedScore / total) * 100 : 0,
    isWinner: i === 0 && r.weightedScore > 0,
    dimmed: r.weightedScore === 0,
    stats: (
      <>
        <span>{total > 0 ? ((r.weightedScore / total) * 100).toFixed(0) : "0"}%</span>
        <span className={sharedStyles.points}>({r.weightedScore} pts)</span>
      </>
    ),
  }));
}

/** Filter-aware performance summary (used inside FilterableBenchmarkSection) */
function PerformanceSummaryInner(): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const { scenarios, libraries } = kanonConfig.benchmarkData;
  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;

  const { rankings, totalScenarios } = useMemo(
    () => calculateFilteredSummary(scenarios, visibleLibraries),
    [scenarios, visibleLibraries],
  );

  return <RankingChart title={translate({ id: 'comparison.benchmark.summary.title', message: '📊 Performance Summary' })} items={rankingsToItems(rankings, totalScenarios)} />;
}

/** Filter-aware weighted summary (used inside FilterableBenchmarkSection) */
function WeightedSummaryInner(): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const { scenarios, libraries, summary } = kanonConfig.benchmarkData;
  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;

  const { rankings, winner } = useMemo(
    () => calculateFilteredSummary(scenarios, visibleLibraries),
    [scenarios, visibleLibraries],
  );

  const totalWeightedScore = rankings.reduce((sum, r) => sum + r.weightedScore, 0);

  return (
    <RankingChart
      title={translate({ id: 'comparison.kanon.weightedSummary.title', message: '📈 Weighted Summary' })}
      announcement={winner ? <>{translate({ id: 'comparison.kanon.weightedSummary.announcement', message: '🏆 {winner} dominates real-world scenarios!' }, { winner })}</> : undefined}
      items={weightedRankingsToItems(rankings, totalWeightedScore)}
    >
      {summary.winnerAdvantage && (
        <p className={styles.advantageNote}>
          {translate(
            { id: 'comparison.kanon.weightedSummary.advantageNote', message: 'On critical + high priority tasks, {winner} is {advantage}x ahead.' },
            { winner: summary.winner, advantage: String(summary.winnerAdvantage) },
          )}
        </p>
      )}
    </RankingChart>
  );
}

/** Filter-aware detailed stats (used inside FilterableBenchmarkSection) */
function DetailedStatsInner(): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? kanonConfig.benchmarkData.libraries;

  const categoryColors: Record<string, string> = {
    CRITICAL: styles.categoryCritical,
    HIGH: styles.categoryHigh,
    MEDIUM: styles.categoryMedium,
    OTHER: styles.categoryOther,
  };

  const scenarios = kanonConfig.benchmarkData.scenarios;

  const columns: Column<ScenarioResult & { isFastestFiltered: boolean }>[] = [
    {
      key: "library",
      header: translate({ id: 'comparison.common.header.library', message: 'Library' }),
      sticky: true,
      width: "120px",
      render: (result) => (
        <>
          <strong>{result.library}</strong>
          {result.isFastestFiltered && <span className={sharedStyles.fastestBadge}> 🏆</span>}
        </>
      ),
    },
    {
      key: "opsPerSecond",
      header: translate({ id: 'comparison.common.header.ops', message: 'ops/s' }),
      className: sharedStyles.opsCell,
      render: (result) => formatOps(result.opsPerSecond),
    },
    { key: "min", header: translate({ id: 'comparison.common.header.min', message: 'min' }), render: (result) => result.stats.min.toFixed(4) },
    { key: "max", header: translate({ id: 'comparison.common.header.max', message: 'max' }), render: (result) => result.stats.max.toFixed(4) },
    { key: "mean", header: translate({ id: 'comparison.common.header.mean', message: 'mean' }), render: (result) => result.stats.mean.toFixed(4) },
    { key: "p75", header: translate({ id: 'comparison.common.header.p75', message: 'p75' }), render: (result) => result.stats.p75.toFixed(4) },
    { key: "p99", header: translate({ id: 'comparison.common.header.p99', message: 'p99' }), render: (result) => result.stats.p99.toFixed(4) },
    { key: "p995", header: translate({ id: 'comparison.common.header.p995', message: 'p995' }), render: (result) => result.stats.p995.toFixed(4) },
    { key: "p999", header: translate({ id: 'comparison.common.header.p999', message: 'p999' }), render: (result) => result.stats.p999.toFixed(4) },
    { key: "rme", header: translate({ id: 'comparison.common.header.rme', message: 'rme' }), render: (result) => result.stats.rme },
    { key: "samples", header: translate({ id: 'comparison.common.header.samples', message: 'samples' }), render: (result) => result.stats.samples.toLocaleString() },
  ];

  return (
    <div className={sharedStyles.detailedContainer}>
      {scenarios.map((scenario) => {
        const visibleResults = scenario.results.filter((r) => visibleLibraries.includes(r.library));
        const maxOps = Math.max(...visibleResults.map((r) => r.opsPerSecond));
        const resultsWithFastest = visibleResults.map((r) => ({
          ...r,
          isFastestFiltered: r.opsPerSecond === maxOps,
        }));

        return (
          <details key={scenario.name} className={sharedStyles.scenarioDetails}>
            <summary className={sharedStyles.scenarioSummary}>
              <span className={sharedStyles.scenarioName}>{scenario.name}</span>
              <span className={`${styles.categoryBadge} ${categoryColors[scenario.category ?? "OTHER"]}`}>
                {scenario.category ?? "OTHER"}
              </span>
            </summary>
            <div className={sharedStyles.detailedTableWrapper}>
              <Table
                columns={columns}
                data={resultsWithFastest}
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

// ============================================
// FilterableBenchmarkSection - wraps filter + all sub-components
// ============================================

export function FilterableBenchmarkSection(): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const groups = kanonConfig.libraryFilter!.groups;
  const allLibraries = kanonConfig.benchmarkData.libraries;

  return (
    <LibraryFilterProvider groups={groups} allLibraries={allLibraries}>
      <LibraryFilterToggle groups={groups} />
      <GenericBenchmarkResultsTable config={kanonConfig} />
      <DashedSeparator />
      <PerformanceSummaryInner />
      <DashedSeparator />
      <WeightedSummaryInner />
      <DashedSeparator />
      <h2>{translate({ id: 'comparison.kanon.detailedStats.title', message: 'Detailed Statistics' })}</h2>
      <p>{translate({ id: 'comparison.kanon.detailedStats.subtitle', message: 'For the skeptics who want to see the raw numbers:' })}</p>
      <DetailedStatsInner />
    </LibraryFilterProvider>
  );
}

// ============================================
// Standalone BenchmarkResultsTable with built-in filter
// (preserves original export behavior - the original wrapped filter + table)
// ============================================

function BenchmarkResultsTableWithFilter(): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const groups = kanonConfig.libraryFilter!.groups;
  const allLibraries = kanonConfig.benchmarkData.libraries;

  return (
    <LibraryFilterProvider groups={groups} allLibraries={allLibraries}>
      <LibraryFilterToggle groups={groups} />
      <GenericBenchmarkResultsTable config={kanonConfig} />
    </LibraryFilterProvider>
  );
}

// ============================================
// Standalone DetailedStats (no filter context, preserves original behavior)
// ============================================

interface DetailedStatsExportedProps {
  scenarioName?: string;
}

function DetailedStatsExported({ scenarioName }: DetailedStatsExportedProps): React.ReactElement {
  if (!kanonConfig.benchmarkData) return <BenchmarkDataMissing />;

  const categoryColors: Record<string, string> = {
    CRITICAL: styles.categoryCritical,
    HIGH: styles.categoryHigh,
    MEDIUM: styles.categoryMedium,
    OTHER: styles.categoryOther,
  };

  const scenarios = scenarioName
    ? kanonConfig.benchmarkData.scenarios.filter((s) => s.name === scenarioName)
    : kanonConfig.benchmarkData.scenarios;

  return (
    <div className={sharedStyles.detailedContainer}>
      {scenarios.map((scenario) => (
        <details key={scenario.name} className={sharedStyles.scenarioDetails}>
          <summary className={sharedStyles.scenarioSummary}>
            <span className={sharedStyles.scenarioName}>{scenario.name}</span>
            <span className={`${styles.categoryBadge} ${categoryColors[scenario.category ?? "OTHER"]}`}>
              {scenario.category ?? "OTHER"}
            </span>
          </summary>
          <div className={styles.statsTableWrapper}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>{translate({ id: 'comparison.common.header.library', message: 'Library' })}</th>
                  <th>{translate({ id: 'comparison.common.header.ops', message: 'ops/s' })}</th>
                  <th>{translate({ id: 'comparison.common.header.min', message: 'min' })}</th>
                  <th>{translate({ id: 'comparison.common.header.max', message: 'max' })}</th>
                  <th>{translate({ id: 'comparison.common.header.mean', message: 'mean' })}</th>
                  <th>{translate({ id: 'comparison.common.header.p75', message: 'p75' })}</th>
                  <th>{translate({ id: 'comparison.common.header.p99', message: 'p99' })}</th>
                  <th>{translate({ id: 'comparison.common.header.p995', message: 'p995' })}</th>
                  <th>{translate({ id: 'comparison.common.header.p999', message: 'p999' })}</th>
                  <th>{translate({ id: 'comparison.common.header.rme', message: 'rme' })}</th>
                  <th>{translate({ id: 'comparison.common.header.samples', message: 'samples' })}</th>
                </tr>
              </thead>
              <tbody>
                {scenario.results.map((result) => (
                  <tr key={result.library} className={result.isFastest ? styles.fastestRow : ""}>
                    <td>
                      <strong>{result.library}</strong>
                      {result.isFastest && <span className={sharedStyles.fastestBadge}>🏆</span>}
                    </td>
                    <td className={sharedStyles.opsCell}>{formatOps(result.opsPerSecond)}</td>
                    <td>{result.stats.min.toFixed(4)}</td>
                    <td>{result.stats.max.toFixed(4)}</td>
                    <td>{result.stats.mean.toFixed(4)}</td>
                    <td>{result.stats.p75.toFixed(4)}</td>
                    <td>{result.stats.p99.toFixed(4)}</td>
                    <td>{result.stats.p995.toFixed(4)}</td>
                    <td>{result.stats.p999.toFixed(4)}</td>
                    <td>{result.stats.rme}</td>
                    <td>{result.stats.samples.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}

// ============================================
// Preserve original export names used by performances.md
// ============================================

export {
  // Original names used in performances.md import
  KanonGeneratedDate as GeneratedDate,
  KanonVersionsTable as VersionsTable,
  KanonPerformanceSummary as PerformanceSummary,
  KanonWeightedSummary as WeightedSummary,
  // BenchmarkResultsTable and DetailedStats have custom implementations
  BenchmarkResultsTableWithFilter as BenchmarkResultsTable,
  DetailedStatsExported as DetailedStats,
};

export default BenchmarkResultsTableWithFilter;
