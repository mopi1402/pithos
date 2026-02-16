import React, { useMemo } from "react";
import { translate } from '@docusaurus/Translate';
import styles from "./styles.module.css";
import { Table, Column } from "@site/src/components/shared/Table";
import { WarningTooltip, WarningModalProvider, useWarningModal } from "@site/src/components/shared/WarningTooltip";
import { SearchableAccordionGroup, type AccordionGroupCategory } from "@site/src/components/shared/SearchableAccordionGroup";
import { RankingChart, type RankingItem } from "@site/src/components/shared/RankingChart";
import ModuleName from "@site/src/components/shared/badges/ModuleName";
import { ModuleConfig, ScenarioData, ScenarioResult, CategoryName, WeightedLibrarySummary, BenchmarkReport, LibraryFilterGroup } from "./types";
import { formatDate, formatOps, getUtilityName, getHeatmapStyle, sortLibraries, sortScenarios } from "./utils";
import { useLibraryFilter } from "./LibraryFilter";
import functionWeights from "@site/src/data/comparisons/function-weights.json";

const categoryConfig = functionWeights.categories as Record<CategoryName, { weight: number }>;

const categoryColors: Record<CategoryName, string> = {
  CRITICAL: styles.categoryCritical,
  HIGH: styles.categoryHigh,
  MEDIUM: styles.categoryMedium,
  LOW: styles.categoryLow,
};

function BenchmarkDataMissing({ moduleName, generateCommand }: { moduleName: string; generateCommand: string }) {
  return (
    <div className={styles.errorContainer}>
      <h3>{translate({ id: 'comparison.benchmark.error.title', message: '⚠️ Benchmark data not found' })}</h3>
      <p>{translate(
        { id: 'comparison.benchmark.error.missing', message: 'The benchmark results file {fileName} is missing.' },
        { fileName: `${moduleName}-benchmark.json` }
      )}</p>
      <p>{translate({ id: 'comparison.benchmark.error.generate', message: 'Generate it by running:' })}</p>
      <pre><code>{generateCommand}</code></pre>
    </div>
  );
}

function TestNameCell<T extends string>({ scenario, config }: { scenario: ScenarioData; config: ModuleConfig<T> }) {
  const warningModal = useWarningModal();
  const [utilityName, detail] = scenario.name.split('\n');
  const weightInfo = config.weights[utilityName];
  const weight = weightInfo ? { ...weightInfo, weight: categoryConfig[weightInfo.category].weight } : null;
  const quasiEquivalent = config.quasiEquivalentFunctions?.[utilityName];
  const isNonEquivalent = config.nonEquivalentFunctions?.includes(utilityName);
  const hasNativeness = !!config.nativenessLevel;
  const nativeness = config.nativenessLevel?.[utilityName] ?? 'native';
  const nativenessIcon = nativeness === 'custom' ? '🔴' : nativeness === 'composition' ? '🟡' : '🟢';
  const nativenessLabel = nativeness === 'custom'
    ? translate({ id: 'comparison.nativeness.custom', message: 'Custom reimplementation' })
    : nativeness === 'composition'
    ? translate({ id: 'comparison.nativeness.composition', message: 'Native composition' })
    : translate({ id: 'comparison.nativeness.native', message: 'Native API' });

  const showTooltip = hasNativeness || !!quasiEquivalent;

  const tooltipContent = hasNativeness ? (
    <>
      <p style={{ margin: 0 }}>{nativenessIcon} {nativenessLabel}</p>
      {quasiEquivalent && (
        <>
          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--ifm-table-border-color)' }} />
          {quasiEquivalent}
        </>
      )}
    </>
  ) : quasiEquivalent;

  const tooltipIcon = hasNativeness ? (
    <>
      <span className={styles.nativenessIcon}>{nativenessIcon}</span>
      {quasiEquivalent && <span className={styles.quasiEquivalentIcon}>⚠️</span>}
    </>
  ) : undefined;

  const modalHeader = hasNativeness
    ? { icon: nativenessIcon, title: translate({ id: 'comparison.nativeness.modalTitle', message: 'Native equivalence' }) }
    : undefined;

  return (
    <div className={`${styles.testName} ${showTooltip ? styles.testNameClickable : ''}`}
         onClick={showTooltip ? () => warningModal?.openModal(tooltipContent, modalHeader) : undefined}>
      <span className={styles.testNameMain}>
        {utilityName}
        {showTooltip && tooltipContent && (
          <WarningTooltip content={tooltipContent} icon={tooltipIcon} />
        )}
        {isNonEquivalent && <span className={styles.nonEquivalentIcon}>🚨</span>}
      </span>
      {detail && <div className={styles.testNameDetail}>{detail}</div>}
      {weight && (
        <div className={styles.testMeta}>
          <span className={`${styles.categoryBadge} ${categoryColors[weight.category]}`} title={weight.reason}>
            {weight.category} | {weight.weight} pts
          </span>
        </div>
      )}
    </div>
  );
}

export function GeneratedDate<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <span>{translate({ id: 'comparison.common.na', message: 'N/A' })}</span>;
  return <span>{formatDate(config.benchmarkData.generatedAt)}</span>;
}

export function PerfTLDR<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  return <p className={styles.tldr}>{config.tldrContent(config.benchmarkData)}</p>;
}


export function VersionsTable<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  const versionEntries = Object.entries(config.benchmarkData.versions)
    .filter(([lib]) => !config.excludedLibraries.includes(lib))
    .sort(([a], [b]) => {
      if (a === config.primaryLibrary) return -1;
      if (b === config.primaryLibrary) return 1;
      if (a === "native") return -1;
      if (b === "native") return 1;
      return a.localeCompare(b);
    });

  const columns: Column<[string, string]>[] = [
    { key: "library", header: translate({ id: 'comparison.common.header.library', message: 'Library' }), sticky: true, width: "140px", render: ([lib]) => lib === config.primaryLibrary ? <ModuleName name={lib} /> : <strong>{lib}</strong> },
    { key: "version", header: translate({ id: 'comparison.common.header.version', message: 'Version' }), width: "100px", render: ([, v]) => <code>{v}</code> },
    { key: "description", header: translate({ id: 'comparison.common.header.description', message: 'Description' }), wrap: true, render: ([lib]) => config.libraryDescriptions[lib] || "-" },
  ];

  return <Table columns={columns} data={versionEntries} keyExtractor={([lib]) => lib}
    footer={<>{translate(
      { id: 'comparison.benchmark.versionsFooter', message: 'Benchmarks run on {date}' },
      { date: formatDate(config.benchmarkData.generatedAt) }
    )}</>} />;
}

/**
 * Recalculate ratios and fastest status for a scenario based on visible libraries only.
 * When a library filter is active, ratios need to be relative to the fastest visible library.
 */
export function recalculateScenarioStats(
  scenario: ScenarioData,
  visibleLibraries: string[]
): Map<string, { ratio: number; isFastest: boolean }> {
  const visibleResults = scenario.results.filter((r) => visibleLibraries.includes(r.library));
  const maxOps = Math.max(...visibleResults.map((r) => r.opsPerSecond), 0);

  const stats = new Map<string, { ratio: number; isFastest: boolean }>();
  for (const result of visibleResults) {
    if (maxOps === 0) {
      stats.set(result.library, { ratio: 1, isFastest: false });
    } else {
      const ratio = maxOps / result.opsPerSecond;
      stats.set(result.library, {
        ratio: Math.round(ratio * 100) / 100,
        isFastest: result.opsPerSecond === maxOps,
      });
    }
  }
  return stats;
}

export function BenchmarkResultsTable<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  const { scenarios, libraries } = config.benchmarkData;
  const filterContext = useLibraryFilter();

  // Apply scenarioFilter if provided
  const filteredScenarios = config.scenarioFilter
    ? scenarios.filter(config.scenarioFilter)
    : scenarios;

  // Get visible libraries from filter context, or use all (minus excluded)
  const visibleLibraries = filterContext?.visibleLibraries ?? libraries;
  const sortedLibraries = sortLibraries(
    libraries.filter((lib) => visibleLibraries.includes(lib)),
    config.primaryLibrary,
    config.excludedLibraries
  );
  const sortedScenarios = sortScenarios(filteredScenarios, config.functionToCategory, config.categoryOrder);

  // Pre-calculate stats for all scenarios based on visible libraries
  const scenarioStats = useMemo(() => {
    const map = new Map<string, Map<string, { ratio: number; isFastest: boolean }>>();
    for (const scenario of sortedScenarios) {
      map.set(scenario.name, recalculateScenarioStats(scenario, visibleLibraries));
    }
    return map;
  }, [sortedScenarios, visibleLibraries]);

  const hasFilter = !!filterContext;

  const sectionExtractor = (s: ScenarioData) => {
    const name = config.formatTestName ? config.formatTestName(s.name) : s.name;
    const cat = config.functionToCategory[getUtilityName(name)];
    return cat ? config.categoryLabels[cat] : null;
  };

  const columns: Column<ScenarioData>[] = [
    { key: "test", header: translate({ id: 'comparison.common.header.test', message: 'Test' }), sticky: true, width: "180px", minWidth: "180px", wrap: true,
      render: (s) => {
        if (config.formatTestName) {
          const formatted = { ...s, name: config.formatTestName(s.name) };
          return <TestNameCell scenario={formatted} config={config} />;
        }
        return <TestNameCell scenario={s} config={config} />;
      } },
    ...sortedLibraries.map((lib) => ({
      key: lib, header: lib, className: styles.resultCell,
      style: (s: ScenarioData) => {
        if (hasFilter) {
          const stats = scenarioStats.get(s.name)?.get(lib);
          return stats ? getHeatmapStyle(stats.ratio, stats.isFastest) : {};
        }
        const r = s.results.find((x) => x.library === lib);
        return r ? getHeatmapStyle(r.ratio, r.isFastest) : {};
      },
      render: (s: ScenarioData) => {
        const r = s.results.find((x) => x.library === lib);
        if (!r) {
          const note = lib === 'native' ? config.nativeUnavailableNote?.[getUtilityName(s.name)] : undefined;
          return <span className={styles.na}>{translate({ id: 'comparison.common.na', message: 'N/A' })}{note && <span className={styles.naNote}> – {note}</span>}</span>;
        }
        if (hasFilter) {
          const stats = scenarioStats.get(s.name)?.get(lib);
          if (!stats) return <span className={styles.na}>{translate({ id: 'comparison.common.na', message: 'N/A' })}</span>;
          return (<>
            <div className={styles.opsValue}>{formatOps(r.opsPerSecond)} <span className={styles.opsUnit}>{translate({ id: 'comparison.common.opsUnit', message: 'ops/s' })}</span></div>
            <div className={styles.ratio}>{stats.isFastest ? <span className={styles.fastestLabel}>{translate({ id: 'comparison.common.fastest', message: 'fastest' })}</span> : <span className={styles.ratioValue}>({stats.ratio}x)</span>}</div>
          </>);
        }
        return (<>
          <div className={styles.opsValue}>{formatOps(r.opsPerSecond)} <span className={styles.opsUnit}>{translate({ id: 'comparison.common.opsUnit', message: 'ops/s' })}</span></div>
          <div className={styles.ratio}>{r.isFastest ? <span className={styles.fastestLabel}>{translate({ id: 'comparison.common.fastest', message: 'fastest' })}</span> : <span className={styles.ratioValue}>({r.ratio}x)</span>}</div>
        </>);
      },
    })),
  ];

  const table = <Table columns={columns} data={sortedScenarios} keyExtractor={(s) => s.name}
    footer={<>{translate(
      { id: 'comparison.benchmark.footer', message: 'Data generated on {date} • Vitest bench' },
      { date: formatDate(config.benchmarkData.generatedAt) }
    )}</>}
    stickyHeader={true} stickyHeaderOffset={config.stickyHeaderOffset} sectionExtractor={sectionExtractor} />;

  const needsModal = (config.quasiEquivalentFunctions && Object.keys(config.quasiEquivalentFunctions).length > 0) || !!config.nativenessLevel;
  return needsModal ? <WarningModalProvider>{table}</WarningModalProvider> : table;
}


export function PerformanceSummary<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  const { summary } = config.benchmarkData;
  const filteredRankings = summary.libraryRankings.filter(r => !config.excludedLibraries.includes(r.library));

  const items: RankingItem[] = filteredRankings.map((r) => ({
    key: r.library,
    label: r.library,
    barPercent: (r.wins / summary.totalScenarios) * 100,
    stats: (
      <>
        <span className={styles.wins}>{translate(
          { id: 'comparison.common.wins', message: '{wins} wins' },
          { wins: String(r.wins) }
        )}</span>
        <span className={styles.percentage}>{translate(
          { id: 'comparison.common.percentage', message: '({percentage}%)' },
          { percentage: ((r.wins / summary.totalScenarios) * 100).toFixed(0) }
        )}</span>
      </>
    ),
  }));

  return <RankingChart title={translate({ id: 'comparison.benchmark.summary.title', message: '📊 Performance Summary' })} items={items} />;
}

export function DetailedStats<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  const columns: Column<ScenarioResult>[] = [
    { key: "library", header: translate({ id: 'comparison.common.header.library', message: 'Library' }), sticky: true, width: "120px", render: (r) => <><strong>{r.library}</strong>{r.isFastest && <span className={styles.fastestBadge}> 🏆</span>}</> },
    { key: "ops", header: translate({ id: 'comparison.common.header.ops', message: 'ops/s' }), className: styles.opsCell, render: (r) => formatOps(r.opsPerSecond) },
    { key: "min", header: translate({ id: 'comparison.common.header.min', message: 'min' }), render: (r) => r.stats.min.toFixed(4) },
    { key: "max", header: translate({ id: 'comparison.common.header.max', message: 'max' }), render: (r) => r.stats.max.toFixed(4) },
    { key: "mean", header: translate({ id: 'comparison.common.header.mean', message: 'mean' }), render: (r) => r.stats.mean.toFixed(4) },
    { key: "p75", header: translate({ id: 'comparison.common.header.p75', message: 'p75' }), render: (r) => r.stats.p75.toFixed(4) },
    { key: "p99", header: translate({ id: 'comparison.common.header.p99', message: 'p99' }), render: (r) => r.stats.p99.toFixed(4) },
    { key: "rme", header: translate({ id: 'comparison.common.header.rme', message: 'rme' }), render: (r) => r.stats.rme },
    { key: "samples", header: translate({ id: 'comparison.common.header.samples', message: 'samples' }), render: (r) => r.stats.samples.toLocaleString() },
  ];

  const scenarios = config.benchmarkData.scenarios;

  // Group scenarios by category
  const grouped = new Map<string, ScenarioData[]>();
  for (const s of scenarios) {
    const cat = config.functionToCategory[getUtilityName(s.name)];
    const label = cat ? config.categoryLabels[cat] : translate({ id: 'comparison.common.categoryOther', message: 'Other' });
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(s);
  }

  // Sort groups by categoryOrder
  const orderedGroups = [...grouped.entries()].sort(([a], [b]) => {
    const labelToKey = Object.fromEntries(
      Object.entries(config.categoryLabels).map(([k, v]) => [v, k])
    );
    const indexA = config.categoryOrder.indexOf(labelToKey[a] as T);
    const indexB = config.categoryOrder.indexOf(labelToKey[b] as T);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const renderScenario = (s: ScenarioData) => (
    <details key={s.name} className={styles.scenarioDetails}>
      <summary className={styles.scenarioSummary}><span className={styles.scenarioName}>{s.name}</span></summary>
      <div className={styles.detailedTableWrapper}>
        <Table columns={columns} data={s.results.filter(r => !config.excludedLibraries.includes(r.library))} keyExtractor={(r) => r.library} stickyHeader={false} />
      </div>
    </details>
  );

  // If no categories defined, render flat list (backward compat)
  if (orderedGroups.length <= 1 && orderedGroups[0]?.[0] === translate({ id: 'comparison.common.categoryOther', message: 'Other' })) {
    const flatCategories: AccordionGroupCategory[] = [{
      title: translate({ id: 'comparison.common.categoryAll', message: 'All' }),
      items: scenarios.map((s) => ({
        key: s.name,
        label: getUtilityName(s.name),
        content: renderScenario(s),
      })),
    }];

    return (
      <div className={styles.detailedContainer}>
        <SearchableAccordionGroup categories={flatCategories} placeholder={translate({ id: 'comparison.common.searchPlaceholder', message: 'Search utility...' })} />
      </div>
    );
  }

  const searchCategories: AccordionGroupCategory[] = orderedGroups.map(([label, groupScenarios]) => ({
    title: label,
    items: groupScenarios.map((s) => ({
      key: s.name,
      label: getUtilityName(s.name),
      content: renderScenario(s),
    })),
  }));

  return (
    <div className={styles.detailedContainer}>
      <SearchableAccordionGroup categories={searchCategories} placeholder={translate({ id: 'comparison.common.searchPlaceholder', message: 'Search utility...' })} />
    </div>
  );
}


export function WeightedSummary<T extends string>({ config }: { config: ModuleConfig<T> }) {
  if (!config.benchmarkData) return <BenchmarkDataMissing moduleName={config.name} generateCommand={config.generateCommand} />;
  const { scenarios, libraries } = config.benchmarkData;

  const weightedScores: WeightedLibrarySummary[] = libraries
    .filter(lib => !config.excludedLibraries.includes(lib))
    .map(lib => {
      let weightedScore = 0, wins = 0;
      const winsByCategory: Record<CategoryName, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
      for (const s of scenarios) {
        const r = s.results.find(x => x.library === lib);
        if (!r?.isFastest) continue;
        wins++;
        const w = config.weights[getUtilityName(s.name)];
        if (w) { weightedScore += categoryConfig[w.category].weight; winsByCategory[w.category]++; }
      }
      return { library: lib, weightedScore, wins, winsByCategory };
    })
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const total = weightedScores.reduce((s, r) => s + r.weightedScore, 0);
  const winner = weightedScores[0];
  const maxScore = scenarios.reduce((s, x) => {
    const w = config.weights[getUtilityName(x.name)];
    return s + (w ? categoryConfig[w.category].weight : 0);
  }, 0);

  const items: RankingItem[] = weightedScores.map((r, i) => ({
    key: r.library,
    label: r.library,
    barPercent: total > 0 ? (r.weightedScore / total) * 100 : 0,
    isWinner: i === 0,
    dimmed: r.weightedScore === 0,
    stats: (
      <>
        <span className={styles.weightedPercentage}>{total > 0 ? ((r.weightedScore / total) * 100).toFixed(0) : "0"}%</span>
        <span className={styles.points}>{translate(
          { id: 'comparison.common.points', message: '({points} pts)' },
          { points: r.weightedScore.toFixed(1) }
        )}</span>
      </>
    ),
  }));

  return (
    <RankingChart
      title={translate({ id: 'comparison.benchmark.weightedSummary.title', message: '📈 Weighted Performance Summary' })}
      subtitle={<>{translate({ id: 'comparison.benchmark.weightedSummary.subtitle', message: 'Scores weighted by real-world importance: CRITICAL (5 pts) > HIGH (3 pts) > MEDIUM (1 pt) > LOW (0.5 pts).' })}</>}
      announcement={winner && winner.weightedScore > 0 ? <>{translate(
        { id: 'comparison.benchmark.weightedSummary.announcement', message: '🏆 {library} leads with {points} pts ({percentage}% of max)' },
        { library: winner.library, points: winner.weightedScore.toFixed(1), percentage: ((winner.weightedScore / maxScore) * 100).toFixed(0) }
      )}</> : undefined}
      items={items}
    >
      <div className={styles.categoryBreakdown}>
        <h4>{translate({ id: 'comparison.benchmark.winsByCategory', message: 'Wins by Category' })}</h4>
        <div className={styles.categoryGrid}>
          {weightedScores.slice(0, 4).map(r => (
            <div key={r.library} className={styles.categoryRow}>
              <span className={styles.categoryLibName}>{r.library}</span>
              <span className={`${styles.categoryCount} ${styles.categoryCritical}`}>{translate(
                { id: 'comparison.benchmark.categoryWins', message: '{count} {category}' },
                { count: String(r.winsByCategory.CRITICAL), category: translate({ id: 'comparison.benchmark.category.critical', message: 'Critical' }) }
              )}</span>
              <span className={`${styles.categoryCount} ${styles.categoryHigh}`}>{translate(
                { id: 'comparison.benchmark.categoryWins', message: '{count} {category}' },
                { count: String(r.winsByCategory.HIGH), category: translate({ id: 'comparison.benchmark.category.high', message: 'High' }) }
              )}</span>
              <span className={`${styles.categoryCount} ${styles.categoryMedium}`}>{translate(
                { id: 'comparison.benchmark.categoryWins', message: '{count} {category}' },
                { count: String(r.winsByCategory.MEDIUM), category: translate({ id: 'comparison.benchmark.category.medium', message: 'Medium' }) }
              )}</span>
              <span className={`${styles.categoryCount} ${styles.categoryLow}`}>{translate(
                { id: 'comparison.benchmark.categoryWins', message: '{count} {category}' },
                { count: String(r.winsByCategory.LOW), category: translate({ id: 'comparison.benchmark.category.low', message: 'Low' }) }
              )}</span>
            </div>
          ))}
        </div>
      </div>
    </RankingChart>
  );
}

export function NativenessLegend<T extends string>({ config }: { config: ModuleConfig<T> }) {
  const hasNativeness = !!config.nativenessLevel;
  const hasQuasiEquivalent = config.quasiEquivalentFunctions && Object.keys(config.quasiEquivalentFunctions).length > 0;
  const hasNonEquivalent = config.nonEquivalentFunctions && config.nonEquivalentFunctions.length > 0;

  if (!hasNativeness && !hasQuasiEquivalent && !hasNonEquivalent) return null;

  return (
    <div className={styles.nativenessLegend}>
      {hasNativeness && (
        <>
          <span className={styles.nativenessLegendItem}>
            <span className={styles.nativenessLegendIcon}>🟢</span>
            {translate({ id: 'comparison.legend.native', message: 'Native API: direct native equivalent' })}
          </span>
          <span className={styles.nativenessLegendItem}>
            <span className={styles.nativenessLegendIcon}>🟡</span>
            {translate({ id: 'comparison.legend.composition', message: 'Composition: built from native APIs' })}
          </span>
          <span className={styles.nativenessLegendItem}>
            <span className={styles.nativenessLegendIcon}>🔴</span>
            {translate({ id: 'comparison.legend.custom', message: 'Custom: no native equivalent' })}
          </span>
        </>
      )}
      {hasQuasiEquivalent && (
        <span className={styles.nativenessLegendItem}>
          <span className={styles.nativenessLegendIcon}>⚠️</span>
          {translate({ id: 'comparison.legend.quasiEquivalent', message: 'Nearly equivalent: subtle behavioral differences' })}
        </span>
      )}
      {hasNonEquivalent && (
        <span className={styles.nativenessLegendItem}>
          <span className={styles.nativenessLegendIcon}>🚨</span>
          {translate({ id: 'comparison.legend.nonEquivalent', message: 'Not equivalent: different behavior' })}
        </span>
      )}
    </div>
  );
}

export type { ModuleConfig, BenchmarkReport, ScenarioData, ScenarioResult, CategoryName, LibraryFilterGroup };
export { LibraryFilterProvider, LibraryFilterToggle, useLibraryFilter } from "./LibraryFilter";
export type { LibraryFilterContextValue } from "./LibraryFilter";
