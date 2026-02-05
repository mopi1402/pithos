import React from "react";
import { translate } from "@docusaurus/Translate";
import {
  GeneratedDate as GenericGeneratedDate,
  PerfTLDR as GenericPerfTLDR,
  VersionsTable as GenericVersionsTable,
  BenchmarkResultsTable as GenericBenchmarkResultsTable,
} from "@site/src/components/comparisons/BenchmarkTable";
import type { ScenarioData } from "@site/src/components/comparisons/BenchmarkTable";
import { Table, type Column } from "@site/src/components/shared/Table";
import { SearchableAccordionGroup } from "@site/src/components/shared/SearchableAccordionGroup";
import { RankingChart, type RankingItem } from "@site/src/components/shared/RankingChart";
import { formatDate, formatOps, normalizeLibraryName } from "@site/src/utils/format";
import { getHeatmapStyle } from "@site/src/utils/heatmap";
import { zygosResultConfig, zygosOptionConfig } from "./config";
import sharedStyles from "@site/src/components/comparisons/BenchmarkTable/styles.module.css";

// ============================================
// Error component
// ============================================

export function ZygosBenchmarkDataMissing(): React.ReactElement {
  return (
    <div className={sharedStyles.errorContainer}>
      <h3>{translate({ id: 'comparison.zygos.error.title', message: '⚠️ Benchmark data not found' })}</h3>
      <p>
        {translate({ id: 'comparison.zygos.error.missing', message: 'The benchmark results file zygos-benchmark.json is missing.' })}
      </p>
      <p>{translate({ id: 'comparison.zygos.error.generate', message: 'Generate it by running:' })}</p>
      <pre>
        <code>{zygosResultConfig.generateCommand}</code>
      </pre>
    </div>
  );
}

// ============================================
// Thin wrapper components (delegate to generic BenchmarkTable)
// ============================================

export const ZygosGeneratedDate = () => <GenericGeneratedDate config={zygosResultConfig} />;
export const ZygosPerfTLDR = () => <GenericPerfTLDR config={zygosResultConfig} />;
export const ZygosVersionsTable = () => <GenericVersionsTable config={zygosResultConfig} />;

// Result table delegates directly to generic BenchmarkResultsTable
// (Result scenarios only contain zygos and neverthrow — no normalization needed)
export const ZygosResultBenchmarkTable = () => <GenericBenchmarkResultsTable config={zygosResultConfig} />;

// ============================================
// Option benchmark table (custom: fp-ts library name normalization)
// ============================================

// The Option table requires normalizing multiple fp-ts/* variants into a single
// "fp-ts" column. Each option scenario has a different fp-ts variant (fp-ts/flatMap,
// fp-ts/fromNullable, etc.) that must be displayed as "fp-ts".
export function ZygosOptionBenchmarkTable(): React.ReactElement {
  const benchmarkData = zygosOptionConfig.benchmarkData;
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const optionScenarios = benchmarkData.scenarios
    .filter((s) => s.name.startsWith("option/"))
    .map((s) => ({
      ...s,
      results: s.results
        .filter((r) => r.library === "zygos" || r.library.startsWith("fp-ts"))
        .map((r) => ({
          ...r,
          library: normalizeLibraryName(r.library),
        })),
    }));

  const libraries = ["zygos", "fp-ts"];

  const columns: Column<ScenarioData>[] = [
    {
      key: "test",
      header: translate({ id: 'comparison.common.header.test', message: 'Test' }),
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
      className: sharedStyles.resultCell,
      style: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) return {};
        return getHeatmapStyle(result.ratio, result.isFastest);
      },
      render: (scenario: ScenarioData) => {
        const result = scenario.results.find((r) => r.library === lib);
        if (!result) {
          return <span className={sharedStyles.na}>{translate({ id: 'comparison.common.na', message: 'N/A' })}</span>;
        }

        return (
          <>
            <div className={sharedStyles.opsValue}>
              {formatOps(result.opsPerSecond)} <span className={sharedStyles.opsUnit}>{translate({ id: 'comparison.common.opsUnit', message: 'ops/s' })}</span>
            </div>
            <div className={sharedStyles.ratio}>
              {result.isFastest ? (
                <span className={sharedStyles.fastestLabel}>{translate({ id: 'comparison.common.fastest', message: 'fastest' })}</span>
              ) : (
                <span className={sharedStyles.ratioValue}>({result.ratio}x)</span>
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
      footer={<>{translate(
        { id: 'comparison.benchmark.footer', message: 'Data generated on {date} • Vitest bench' },
        { date: formatDate(benchmarkData.generatedAt) }
      )}</>}
      stickyHeader={true}
    />
  );
}

// ============================================
// Performance summary (custom: Result vs Option win breakdown)
// ============================================

// Zygos uses a custom summary showing Result vs Option win rates,
// unlike the standard library-ranking summary used by other modules.
export function ZygosPerformanceSummary(): React.ReactElement {
  const benchmarkData = zygosResultConfig.benchmarkData;
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const resultScenarios = benchmarkData.scenarios.filter((s) => s.name.startsWith("result/"));
  const zygosResultWins = resultScenarios.filter((s) =>
    s.results.find((r) => r.library === "zygos")?.isFastest
  ).length;

  const optionScenarios = benchmarkData.scenarios.filter((s) => s.name.startsWith("option/"));
  const zygosOptionWins = optionScenarios.length;

  const items: RankingItem[] = [
    {
      key: "result",
      label: translate({ id: 'comparison.zygos.summary.resultLabel', message: 'Result (vs Neverthrow)' }),
      barPercent: (zygosResultWins / resultScenarios.length) * 100,
      medal: "",
      stats: <span className={sharedStyles.wins}>{translate({ id: 'comparison.zygos.summary.zygosWins', message: '🏆 Zygos: {wins}/{total}' }, { wins: String(zygosResultWins), total: String(resultScenarios.length) })}</span>,
    },
    {
      key: "option",
      label: translate({ id: 'comparison.zygos.summary.optionLabel', message: 'Option (vs fp-ts)' }),
      barPercent: (zygosOptionWins / optionScenarios.length) * 100,
      medal: "",
      stats: <span className={sharedStyles.wins}>{translate({ id: 'comparison.zygos.summary.zygosWins', message: '🏆 Zygos: {wins}/{total}' }, { wins: String(zygosOptionWins), total: String(optionScenarios.length) })}</span>,
    },
  ];

  return <RankingChart title={translate({ id: 'comparison.benchmark.summary.title', message: '📊 Performance Summary' })} items={items} />;
}

// Detailed stats: custom implementation that groups scenarios into Option/Result accordions
// with the prefix stripped from item labels
export function ZygosDetailedStats(): React.ReactElement {
  const benchmarkData = zygosResultConfig.benchmarkData;
  if (!benchmarkData) return <ZygosBenchmarkDataMissing />;

  const columns: Column<ScenarioData["results"][number]>[] = [
    { key: "library", header: translate({ id: 'comparison.common.header.library', message: 'Library' }), sticky: true, width: "120px", render: (r) => <><strong>{r.library}</strong>{r.isFastest && <span className={sharedStyles.fastestBadge}> 🏆</span>}</> },
    { key: "ops", header: translate({ id: 'comparison.common.header.ops', message: 'ops/s' }), className: sharedStyles.opsCell, render: (r) => formatOps(r.opsPerSecond) },
    { key: "min", header: translate({ id: 'comparison.common.header.min', message: 'min' }), render: (r) => r.stats.min.toFixed(4) },
    { key: "max", header: translate({ id: 'comparison.common.header.max', message: 'max' }), render: (r) => r.stats.max.toFixed(4) },
    { key: "mean", header: translate({ id: 'comparison.common.header.mean', message: 'mean' }), render: (r) => r.stats.mean.toFixed(4) },
    { key: "p75", header: translate({ id: 'comparison.common.header.p75', message: 'p75' }), render: (r) => r.stats.p75.toFixed(4) },
    { key: "p99", header: translate({ id: 'comparison.common.header.p99', message: 'p99' }), render: (r) => r.stats.p99.toFixed(4) },
    { key: "rme", header: translate({ id: 'comparison.common.header.rme', message: 'rme' }), render: (r) => r.stats.rme },
    { key: "samples", header: translate({ id: 'comparison.common.header.samples', message: 'samples' }), render: (r) => r.stats.samples.toLocaleString() },
  ];

  const renderScenario = (s: ScenarioData, excludedLibs: string[]) => (
    <details key={s.name} className={sharedStyles.scenarioDetails}>
      <summary className={sharedStyles.scenarioSummary}>
        <span className={sharedStyles.scenarioName}>{s.name.replace(/^(option|result)\//, '')}</span>
      </summary>
      <div className={sharedStyles.detailedTableWrapper}>
        <Table columns={columns} data={s.results.filter(r => !excludedLibs.includes(r.library))} keyExtractor={(r) => r.library} stickyHeader={false} />
      </div>
    </details>
  );

  const resultScenarios = benchmarkData.scenarios.filter((s) => s.name.startsWith("result/"));
  const optionScenarios = benchmarkData.scenarios.filter((s) => s.name.startsWith("option/"));

  const categories: import("@site/src/components/shared/SearchableAccordionGroup").AccordionGroupCategory[] = [
    {
      title: "Result",
      items: resultScenarios.map((s) => ({
        key: s.name,
        label: s.name.replace("result/", ""),
        content: renderScenario(s, zygosResultConfig.excludedLibraries),
      })),
    },
    {
      title: "Option",
      items: optionScenarios.map((s) => ({
        key: s.name,
        label: s.name.replace("option/", ""),
        content: renderScenario(s, zygosOptionConfig.excludedLibraries),
      })),
    },
  ];

  return (
    <div className={sharedStyles.detailedContainer}>
      <SearchableAccordionGroup categories={categories} placeholder={translate({ id: 'comparison.common.searchPlaceholder', message: 'Search utility...' })} />
    </div>
  );
}

export default ZygosResultBenchmarkTable;
