import React, { createContext, useContext, useState, useMemo } from "react";
import styles from "./styles.module.css";
import { Table, Column } from "../Table";
import { StickyBar } from "../StickyBar/StickyBar";

// Try to import the generated data - will throw if not found
let benchmarkData: BenchmarkReport | null = null;
try {
  benchmarkData = require("../../data/kanon-benchmark-realworld.json");
} catch {
  benchmarkData = null;
}

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "OTHER";

// ============================================
// Library Groups for Filtering
// ============================================

export const LIBRARY_GROUPS = {
  "schema-first": {
    label: "Schema-first",
    description: "Developer-friendly schema definition libraries",
    libraries: ["@kanon/V3.0", "Zod", "Valibot", "Superstruct"],
  },
  "compiled": {
    label: "Compiled / JIT",
    description: "Performance-focused libraries with code generation",
    libraries: ["@kanon/JIT", "AJV", "TypeBox", "Fast-Validator"],
  },
} as const;

export type LibraryGroup = keyof typeof LIBRARY_GROUPS;

// ============================================
// Filter Context
// ============================================

interface LibraryFilterContextValue {
  selectedGroups: Set<LibraryGroup>;
  toggleGroup: (group: LibraryGroup) => void;
  selectedLibraries: Set<string>;
  toggleLibrary: (lib: string) => void;
  visibleLibraries: string[];
}

const LibraryFilterContext = createContext<LibraryFilterContextValue | null>(null);

function useLibraryFilter(): LibraryFilterContextValue | null {
  return useContext(LibraryFilterContext);
}

interface LibraryFilterProviderProps {
  children: React.ReactNode;
}

function LibraryFilterProvider({ children }: LibraryFilterProviderProps): React.ReactElement {
  // All libraries from all groups
  const allLibraries = useMemo(() => {
    const libs = new Set<string>();
    for (const group of Object.values(LIBRARY_GROUPS)) {
      for (const lib of group.libraries) {
        libs.add(lib);
      }
    }
    return Array.from(libs);
  }, []);

  // By default, all groups and all libraries are selected
  const [selectedGroups, setSelectedGroups] = useState<Set<LibraryGroup>>(
    new Set(Object.keys(LIBRARY_GROUPS) as LibraryGroup[])
  );
  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(
    new Set(allLibraries)
  );

  const toggleGroup = (group: LibraryGroup) => {
    const groupLibs = LIBRARY_GROUPS[group].libraries;
    
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
        // Uncheck all libs in this group
        setSelectedLibraries((prevLibs) => {
          const nextLibs = new Set(prevLibs);
          for (const lib of groupLibs) {
            nextLibs.delete(lib);
          }
          return nextLibs;
        });
      } else {
        next.add(group);
        // Check all libs in this group
        setSelectedLibraries((prevLibs) => {
          const nextLibs = new Set(prevLibs);
          for (const lib of groupLibs) {
            nextLibs.add(lib);
          }
          return nextLibs;
        });
      }
      return next;
    });
  };

  const toggleLibrary = (lib: string) => {
    setSelectedLibraries((prev) => {
      const next = new Set(prev);
      if (next.has(lib)) {
        next.delete(lib);
      } else {
        next.add(lib);
      }
      return next;
    });
  };

  const visibleLibraries = useMemo(() => {
    // If nothing selected, show all
    if (selectedLibraries.size === 0) {
      return benchmarkData?.libraries ?? [];
    }
    return Array.from(selectedLibraries);
  }, [selectedLibraries]);

  return (
    <LibraryFilterContext.Provider value={{ 
      selectedGroups, 
      toggleGroup, 
      selectedLibraries, 
      toggleLibrary, 
      visibleLibraries 
    }}>
      {children}
    </LibraryFilterContext.Provider>
  );
}

// ============================================
// Filter Toggle Component
// ============================================

function LibraryFilterToggle(): React.ReactElement | null {
  const context = useLibraryFilter();

  if (!context) {
    return null;
  }

  const { selectedGroups, toggleGroup, selectedLibraries, toggleLibrary } = context;

  // Only show libraries from selected groups, or all if no group selected
  const availableLibraries = useMemo(() => {
    const libs: { lib: string; group: LibraryGroup }[] = [];
    const groupsToShow = selectedGroups.size > 0 
      ? selectedGroups 
      : new Set(Object.keys(LIBRARY_GROUPS) as LibraryGroup[]);
    
    for (const group of groupsToShow) {
      for (const lib of LIBRARY_GROUPS[group].libraries) {
        libs.push({ lib, group });
      }
    }
    return libs;
  }, [selectedGroups]);

  return (
    <StickyBar>
      <div className={styles.filterContainer}>
        <div className={styles.filterToggleGroup}>
          <span className={styles.filterLabel}>Groups:</span>
          <div className={styles.filterToggleList}>
            {(Object.entries(LIBRARY_GROUPS) as [LibraryGroup, typeof LIBRARY_GROUPS[LibraryGroup]][]).map(
              ([group, config]) => (
                <label key={group} className={styles.filterToggle} title={config.description}>
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(group)}
                    onChange={() => toggleGroup(group)}
                  />
                  <span>{config.label}</span>
                </label>
              )
            )}
          </div>
        </div>
        {availableLibraries.length > 0 && (
          <>
            <div className={styles.filterDivider} />
            <div className={styles.filterLibrariesGroup}>
              <span className={styles.filterLabel}>Libraries:</span>
              <div className={styles.filterLibrariesList}>
                {availableLibraries.map(({ lib }) => (
                  <label 
                    key={lib} 
                    className={`${styles.filterLibrary} ${selectedLibraries.has(lib) ? styles.filterLibraryActive : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLibraries.has(lib)}
                      onChange={() => toggleLibrary(lib)}
                    />
                    <span>{lib}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </StickyBar>
  );
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
  category: CategoryName;
  weight: number;
  durationMs: number;
  results: ScenarioResult[];
}

interface LibrarySummary {
  library: string;
  wins: number;
  weightedScore: number;
}

interface BenchmarkReport {
  generatedAt: string;
  benchmarkType: string;
  versions: Record<string, string>;
  libraries: string[];
  scenarios: ScenarioData[];
  summary: {
    totalScenarios: number;
    libraryRankings: LibrarySummary[];
    winner: string;
    winnerAdvantage: number | null;
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

function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

// Format test name with zero-width space before parentheses for mobile line breaks
function formatTestName(name: string): string {
  return name.replace(/ \(/g, " \u200B(");
}
const categoryColors: Record<CategoryName, string> = {
  CRITICAL: styles.categoryCritical,
  HIGH: styles.categoryHigh,
  MEDIUM: styles.categoryMedium,
  OTHER: styles.categoryOther,
};

// Error component when data is missing
export function BenchmarkDataMissing(): React.ReactElement {
  return (
    <div className={styles.errorContainer}>
      <h3>⚠️ Benchmark data not found</h3>
      <p>
        The benchmark results file <code>kanon-benchmark-realworld.json</code> is missing.
      </p>
      <p>Generate it by running:</p>
      <pre>
        <code>pnpm doc:generate:kanon:benchmarks-results</code>
      </pre>
    </div>
  );
}

// Library descriptions for the versions table
const libraryDescriptions: Record<string, string> = {
  kanon: "Pithos validation module (schema-first + JIT)",
  zod: "Schema-first validation with TypeScript inference",
  valibot: "Modular schema validation, tree-shakeable",
  superstruct: "Composable validation with custom types",
  ajv: "JSON Schema validator with JIT compilation",
  "@sinclair/typebox": "JSON Schema with TypeScript inference + JIT",
  "fastest-validator": "High-performance validator with JIT",
};

// Normalize library names for display
function formatLibraryName(lib: string): string {
  if (lib === "kanon") return "Kanon";
  if (lib === "@sinclair/typebox") return "typebox";
  if (lib === "fastest-validator") return "fastest-\u200Bvalidator";
  return lib;
}

// Version info component - uses generic Table for consistency
export function VersionsTable(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const versions = benchmarkData.versions;
  const versionEntries = Object.entries(versions).sort(([a], [b]) => {
    // Put kanon first
    if (a === "kanon") return -1;
    if (b === "kanon") return 1;
    return a.localeCompare(b);
  });

  const columns: Column<[string, string]>[] = [
    {
      key: "library",
      header: "Library",
      sticky: true,
      width: "120px",
      maxWidth: "120px",
      wrap: true,
      render: ([lib]) => <strong>{formatLibraryName(lib)}</strong>,
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

// Generated date component
export function GeneratedDate(): React.ReactElement {
  if (!benchmarkData) return <span>N/A</span>;
  return <span>{formatDate(benchmarkData.generatedAt)}</span>;
}

// TL;DR component
export function KanonPerfTLDR(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  return (
    <p className={styles.tldr}>
      <strong>Kanon JIT dominates on discriminated unions and complex schemas.</strong> TypeBox/AJV win on simple validations. For typical API/form validation, <span className={styles.highlight}>Kanon is 2-3x faster</span> than Zod/Valibot.
    </p>
  );
}

// Helper to get heatmap color based on ratio (1 = fastest = green, higher = slower = red)
function getHeatmapStyle(ratio: number, isFastest: boolean): React.CSSProperties {
  if (isFastest) {
    // Fastest: bright green
    return { backgroundColor: "rgba(0, 200, 83, 0.35)" };
  }
  
  // Calculate color based on ratio
  // ratio 1.0-1.5: green to yellow-green
  // ratio 1.5-3.0: yellow-green to orange
  // ratio 3.0+: orange to red
  
  if (ratio <= 1.5) {
    // Green zone (good)
    const t = (ratio - 1) / 0.5; // 0 to 1
    const green = Math.round(200 - t * 50);
    const red = Math.round(t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 50, 0.25)` };
  } else if (ratio <= 3) {
    // Yellow-orange zone (medium)
    const t = (ratio - 1.5) / 1.5; // 0 to 1
    const green = Math.round(150 - t * 80);
    const red = Math.round(100 + t * 100);
    return { backgroundColor: `rgba(${red}, ${green}, 30, 0.25)` };
  } else if (ratio <= 10) {
    // Orange-red zone (slow)
    const t = Math.min((ratio - 3) / 7, 1); // 0 to 1
    const green = Math.round(70 - t * 50);
    const red = Math.round(200 + t * 55);
    return { backgroundColor: `rgba(${red}, ${green}, 20, 0.25)` };
  } else {
    // Very slow: dark red
    return { backgroundColor: "rgba(255, 50, 50, 0.3)" };
  }
}

// Helper to recalculate ratios based on visible libraries only
function recalculateScenarioStats(
  scenario: ScenarioData,
  visibleLibraries: string[]
): Map<string, { ratio: number; isFastest: boolean }> {
  const visibleResults = scenario.results.filter((r) => visibleLibraries.includes(r.library));
  const maxOps = Math.max(...visibleResults.map((r) => r.opsPerSecond));
  
  const stats = new Map<string, { ratio: number; isFastest: boolean }>();
  for (const result of visibleResults) {
    const ratio = maxOps / result.opsPerSecond;
    stats.set(result.library, {
      ratio: Math.round(ratio * 100) / 100,
      isFastest: result.opsPerSecond === maxOps,
    });
  }
  return stats;
}

// Main benchmark results table (internal, uses filter context)
function BenchmarkResultsTableInner(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const { scenarios, libraries } = benchmarkData;
  const filterContext = useLibraryFilter();

  // Get visible libraries from filter context, or show all if no context
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;

  // Sort libraries: Kanon first, then alphabetically
  const sortedLibraries = [...libraries]
    .filter((lib) => visibleLibraries.includes(lib))
    .sort((a, b) => {
      if (a.startsWith("@kanon")) return -1;
      if (b.startsWith("@kanon")) return 1;
      return a.localeCompare(b);
    });

  // Pre-calculate stats for all scenarios based on visible libraries
  const scenarioStats = useMemo(() => {
    const map = new Map<string, Map<string, { ratio: number; isFastest: boolean }>>();
    for (const scenario of scenarios) {
      map.set(scenario.name, recalculateScenarioStats(scenario, visibleLibraries));
    }
    return map;
  }, [scenarios, visibleLibraries]);

  const columns: Column<ScenarioData>[] = [
    {
      key: "test",
      header: "Test",
      sticky: true,
      width: "150px",
      minWidth: "150px",
      wrap: true,
      render: (scenario) => (
        <div>
          <div className={styles.testName}>{formatTestName(scenario.name)}</div>
          <div className={styles.testMeta}>
            <span className={`${styles.categoryBadge} ${categoryColors[scenario.category]}`}>
              {scenario.category} | {scenario.weight} pts
            </span>
            <span className={styles.duration}>{formatDuration(scenario.durationMs)}</span>
          </div>
        </div>
      ),
    },
    ...sortedLibraries.map((lib) => ({
      key: lib,
      header: lib,
      className: styles.resultCell,
      style: (scenario: ScenarioData) => {
        const stats = scenarioStats.get(scenario.name)?.get(lib);
        if (!stats) return {};
        return getHeatmapStyle(stats.ratio, stats.isFastest);
      },
      render: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        const stats = scenarioStats.get(scenario.name)?.get(lib);
        if (!result || !stats) {
          return <span className={styles.na}>N/A</span>;
        }

        return (
          <>
            <div className={styles.opsValue}>
              {formatOps(result.opsPerSecond)} <span className={styles.opsUnit}>ops/s</span>
            </div>
            <div className={styles.ratio}>
              {stats.isFastest ? (
                <span className={styles.fastestLabel}>fastest</span>
              ) : (
                <span className={styles.ratioValue}>({stats.ratio}x)</span>
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
      stickyHeaderOffset={120}
    />
  );
}

// Main benchmark results table (exported, with filter wrapper)
export function BenchmarkResultsTable(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  return (
    <LibraryFilterProvider>
      <LibraryFilterToggle />
      <BenchmarkResultsTableInner />
    </LibraryFilterProvider>
  );
}

// Helper to calculate summary stats based on visible libraries
function calculateFilteredSummary(
  scenarios: ScenarioData[],
  visibleLibraries: string[]
): { rankings: LibrarySummary[]; winner: string | null; totalScenarios: number } {
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
      scoreMap.set(fastest.library, (scoreMap.get(fastest.library) || 0) + scenario.weight);
    }
  }

  const rankings: LibrarySummary[] = visibleLibraries
    .map((lib) => ({
      library: lib,
      wins: winsMap.get(lib) || 0,
      weightedScore: scoreMap.get(lib) || 0,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore || b.wins - a.wins);

  const winner = rankings.length > 0 && rankings[0].wins > 0 ? rankings[0].library : null;

  return { rankings, winner, totalScenarios: scenarios.length };
}

// Performance summary component (internal, uses filter context)
function PerformanceSummaryInner(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const { scenarios, libraries } = benchmarkData;
  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;

  const { rankings, totalScenarios } = useMemo(
    () => calculateFilteredSummary(scenarios, visibleLibraries),
    [scenarios, visibleLibraries]
  );

  return (
    <div className={styles.summaryContainer}>
      <h3>� Performance Summary</h3>
      <div className={styles.summaryGrid}>
        {rankings.map((ranking, index) => {
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Performance summary component (exported)
export function PerformanceSummary(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const { summary } = benchmarkData;
  const totalScenarios = summary.totalScenarios;

  return (
    <div className={styles.summaryContainer}>
      <h3>📊 Performance Summary</h3>
      <div className={styles.summaryGrid}>
        {summary.libraryRankings.map((ranking, index) => {
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Weighted summary component (internal, uses filter context)
function WeightedSummaryInner(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const { scenarios, libraries } = benchmarkData;
  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;

  const { rankings, winner } = useMemo(
    () => calculateFilteredSummary(scenarios, visibleLibraries),
    [scenarios, visibleLibraries]
  );

  const totalWeightedScore = rankings.reduce((sum, r) => sum + r.weightedScore, 0);
  const rankedLibraries = rankings.filter((r) => r.weightedScore > 0);
  const unrankedLibraries = rankings.filter((r) => r.weightedScore === 0);

  return (
    <div className={styles.weightedContainer}>
      <h3>📈 Weighted Summary</h3>
      {winner && (
        <p className={styles.winnerAnnouncement}>
          🏆 <strong>{winner}</strong> dominates real-world scenarios!
        </p>
      )}
      <div className={styles.weightedGrid}>
        {rankedLibraries.map((ranking, index) => {
          const percentage = totalWeightedScore > 0
            ? ((ranking.weightedScore / totalWeightedScore) * 100).toFixed(0)
            : "0";
          const barWidth = totalWeightedScore > 0
            ? (ranking.weightedScore / totalWeightedScore) * 100
            : 0;

          return (
            <div key={ranking.library} className={styles.weightedRow}>
              <div className={styles.weightedLabel}>
                <span className={styles.libName}>{ranking.library}</span>
              </div>
              <div className={styles.weightedBar}>
                <div
                  className={`${styles.weightedBarFill} ${index === 0 ? styles.winner : ""}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={styles.weightedStats}>
                <span>{percentage}%</span>
                <span className={styles.points}>({ranking.weightedScore} pts)</span>
              </div>
            </div>
          );
        })}
        {unrankedLibraries.map((ranking) => (
          <div key={ranking.library} className={styles.weightedRow}>
            <div className={styles.weightedLabel}>
              <span className={`${styles.libName} ${styles.unranked}`}>{ranking.library}</span>
            </div>
            <div className={styles.weightedBar}>
              <div className={styles.weightedBarEmpty} />
            </div>
            <div className={styles.weightedStats}>
              <span className={styles.unranked}>0%</span>
              <span className={`${styles.points} ${styles.unranked}`}>(0 pts)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Weighted summary component (exported)
export function WeightedSummary(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const { summary } = benchmarkData;
  const totalWeightedScore = summary.libraryRankings.reduce(
    (sum, r) => sum + r.weightedScore,
    0
  );

  // Filter to only show libraries with scores
  const rankedLibraries = summary.libraryRankings.filter((r) => r.weightedScore > 0);
  const unrankedLibraries = summary.libraryRankings.filter((r) => r.weightedScore === 0);

  return (
    <div className={styles.weightedContainer}>
      <h3>📈 Weighted Summary</h3>
      {summary.winner && (
        <p className={styles.winnerAnnouncement}>
          🏆 <strong>{summary.winner}</strong> dominates real-world scenarios!
        </p>
      )}
      <div className={styles.weightedGrid}>
        {rankedLibraries.map((ranking, index) => {
          const percentage = totalWeightedScore > 0
            ? ((ranking.weightedScore / totalWeightedScore) * 100).toFixed(0)
            : "0";
          const barWidth = totalWeightedScore > 0
            ? (ranking.weightedScore / totalWeightedScore) * 100
            : 0;

          return (
            <div key={ranking.library} className={styles.weightedRow}>
              <div className={styles.weightedLabel}>
                <span className={styles.libName}>{ranking.library}</span>
              </div>
              <div className={styles.weightedBar}>
                <div
                  className={`${styles.weightedBarFill} ${index === 0 ? styles.winner : ""}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={styles.weightedStats}>
                <span>{percentage}%</span>
                <span className={styles.points}>({ranking.weightedScore} pts)</span>
              </div>
            </div>
          );
        })}
        {unrankedLibraries.map((ranking) => (
          <div key={ranking.library} className={styles.weightedRow}>
            <div className={styles.weightedLabel}>
              <span className={`${styles.libName} ${styles.unranked}`}>{ranking.library}</span>
            </div>
            <div className={styles.weightedBar}>
              <div className={styles.weightedBarEmpty} />
            </div>
            <div className={styles.weightedStats}>
              <span className={styles.unranked}>0%</span>
              <span className={`${styles.points} ${styles.unranked}`}>(0 pts)</span>
            </div>
          </div>
        ))}
      </div>
      {summary.winnerAdvantage && (
        <p className={styles.advantageNote}>
          On critical + high priority tasks, <strong>{summary.winner}</strong> is{" "}
          <strong>{summary.winnerAdvantage}x</strong> ahead.
        </p>
      )}
    </div>
  );
}

// Full benchmark section with filter (table + summaries + detailed stats)
export function FilterableBenchmarkSection(): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  return (
    <LibraryFilterProvider>
      <LibraryFilterToggle />
      <BenchmarkResultsTableInner />
      <PerformanceSummaryInner />
      <WeightedSummaryInner />
      <h2>Detailed Statistics</h2>
      <p>For the skeptics who want to see the raw numbers:</p>
      <DetailedStatsInner />
    </LibraryFilterProvider>
  );
}

// Detailed stats table (internal, uses filter context)
function DetailedStatsInner({ scenarioName }: DetailedStatsProps): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const filterContext = useLibraryFilter();
  const visibleLibraries = filterContext?.visibleLibraries ?? benchmarkData.libraries;

  const scenarios = scenarioName
    ? benchmarkData.scenarios.filter((s) => s.name === scenarioName)
    : benchmarkData.scenarios;

  const columns: Column<ScenarioResult & { isFastestFiltered: boolean }>[] = [
    {
      key: "library",
      header: "Library",
      sticky: true,
      width: "120px",
      render: (result) => (
        <>
          <strong>{result.library}</strong>
          {result.isFastestFiltered && <span className={styles.fastestBadge}> 🏆</span>}
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
    { key: "p995", header: "p995", render: (result) => result.stats.p995.toFixed(4) },
    { key: "p999", header: "p999", render: (result) => result.stats.p999.toFixed(4) },
    { key: "rme", header: "rme", render: (result) => result.stats.rme },
    { key: "samples", header: "samples", render: (result) => result.stats.samples.toLocaleString() },
  ];

  return (
    <div className={styles.detailedContainer}>
      {scenarios.map((scenario) => {
        const visibleResults = scenario.results.filter((r) => visibleLibraries.includes(r.library));
        const maxOps = Math.max(...visibleResults.map((r) => r.opsPerSecond));
        const resultsWithFastest = visibleResults.map((r) => ({
          ...r,
          isFastestFiltered: r.opsPerSecond === maxOps,
        }));

        return (
          <details key={scenario.name} className={styles.scenarioDetails}>
            <summary className={styles.scenarioSummary}>
              <span className={styles.scenarioName}>{scenario.name}</span>
              <span className={`${styles.categoryBadge} ${categoryColors[scenario.category]}`}>
                {scenario.category}
              </span>
            </summary>
            <div className={styles.detailedTableWrapper}>
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

// Detailed stats table (exportable per scenario)
interface DetailedStatsProps {
  scenarioName?: string;
}

export function DetailedStats({ scenarioName }: DetailedStatsProps): React.ReactElement {
  if (!benchmarkData) return <BenchmarkDataMissing />;

  const scenarios = scenarioName
    ? benchmarkData.scenarios.filter((s) => s.name === scenarioName)
    : benchmarkData.scenarios;

  return (
    <div className={styles.detailedContainer}>
      {scenarios.map((scenario) => (
        <details key={scenario.name} className={styles.scenarioDetails}>
          <summary className={styles.scenarioSummary}>
            <span className={styles.scenarioName}>{scenario.name}</span>
            <span className={`${styles.categoryBadge} ${categoryColors[scenario.category]}`}>
              {scenario.category}
            </span>
          </summary>
          <div className={styles.statsTableWrapper}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Library</th>
                  <th>ops/s</th>
                  <th>min</th>
                  <th>max</th>
                  <th>mean</th>
                  <th>p75</th>
                  <th>p99</th>
                  <th>p995</th>
                  <th>p999</th>
                  <th>rme</th>
                  <th>samples</th>
                </tr>
              </thead>
              <tbody>
                {scenario.results.map((result) => (
                  <tr key={result.library} className={result.isFastest ? styles.fastestRow : ""}>
                    <td>
                      <strong>{result.library}</strong>
                      {result.isFastest && <span className={styles.fastestBadge}>🏆</span>}
                    </td>
                    <td className={styles.opsCell}>{formatOps(result.opsPerSecond)}</td>
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

export default BenchmarkResultsTable;
