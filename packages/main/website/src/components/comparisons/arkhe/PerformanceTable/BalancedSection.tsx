import React, { useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { Table, Column } from "@site/src/components/shared/Table";
import { RankingChart, type RankingItem } from "@site/src/components/shared/RankingChart";
import type { BundleData } from "../BundleSizeTable/types";
import type { BenchmarkReport } from "@site/src/components/comparisons/BenchmarkTable/types";
import functionWeights from "@site/src/data/comparisons/function-weights.json";
import styles from "./balanced.module.css";

import bundleData from "@site/src/data/comparisons/arkhe-taphos-bundle-sizes.json";

let benchmarkData: BenchmarkReport | null = null;
try { benchmarkData = require("@site/src/data/benchmarks/arkhe-benchmark.json"); } catch { benchmarkData = null; }

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Verdict = "both" | "bundle-only" | "perf-only" | "neither";

const arkheWeights = functionWeights.modules.arkhe as Record<string, { category: CategoryName; reason: string }>;

interface FunctionVerdict {
  name: string;
  verdict: Verdict;
  weight: CategoryName | null;
  bundleWin: boolean;
  perfWin: boolean;
  bundleDiff: string;
  perfDetail: string;
}

function computeVerdicts(): FunctionVerdict[] {
  if (!benchmarkData) return [];

  const bundle = bundleData as BundleData;
  const moduleData = bundle.modules.arkhe;

  // Get all unique function names from benchmark data
  const benchFnNames = [...new Set(benchmarkData.scenarios.map(s => s.name.split("\n")[0]))];

  // Only keep functions that exist in both bundle and benchmark data
  const bundleFnSet = new Set(moduleData.topUtils);
  const commonFns = benchFnNames.filter(fn => bundleFnSet.has(fn));

  const results: FunctionVerdict[] = [];

  for (const fn of commonFns) {
    // Bundle comparison: pithos vs es-toolkit + lodash only
    const pithosBundle = moduleData.results.find(r => r.utilName === fn && r.library === "pithos");
    const competitorBundleLibs = ["es-toolkit", "lodash"];
    const competitorBundles = moduleData.results.filter(
      r => r.utilName === fn && competitorBundleLibs.includes(r.library) && r.gzipBytes !== null
    );

    let bundleWin = false;
    let bundleDiff = "";
    if (pithosBundle?.gzipBytes && competitorBundles.length > 0) {
      const smallest = Math.min(...competitorBundles.map(r => r.gzipBytes!));
      bundleWin = pithosBundle.gzipBytes <= smallest * 1.1;
      const pct = Math.round(((pithosBundle.gzipBytes - smallest) / smallest) * 100);
      bundleDiff = pct <= 0 ? `${pct}%` : `+${pct}%`;
    }

    // Perf comparison: arkhe vs es-toolkit, es-toolkit/compat, lodash-es
    const fnScenarios = benchmarkData.scenarios.filter(s => s.name.split("\n")[0] === fn);
    const arkheWins = fnScenarios.filter(s => {
      const r = s.results.find(x => x.library === "arkhe");
      return r?.isFastest;
    }).length;
    const perfWin = arkheWins > 0;
    const perfDetail = `${arkheWins}/${fnScenarios.length}`;

    const weight = arkheWeights[fn]?.category ?? null;

    let verdict: Verdict;
    if (bundleWin && perfWin) verdict = "both";
    else if (bundleWin && !perfWin) verdict = "bundle-only";
    else if (!bundleWin && perfWin) verdict = "perf-only";
    else verdict = "neither";

    results.push({ name: fn, verdict, weight, bundleWin, perfWin, bundleDiff, perfDetail });
  }

  return results;
}

const verdictConfig: Record<Verdict, { icon: string; label: string; className: string }> = {
  both: {
    icon: "✅",
    label: translate({ id: "comparison.arkhe.balanced.verdict.both", message: "Bundle + Perf" }),
    className: styles.verdictBoth,
  },
  "bundle-only": {
    icon: "📦",
    label: translate({ id: "comparison.arkhe.balanced.verdict.bundleOnly", message: "Bundle only" }),
    className: styles.verdictBundle,
  },
  "perf-only": {
    icon: "⚡",
    label: translate({ id: "comparison.arkhe.balanced.verdict.perfOnly", message: "Perf only" }),
    className: styles.verdictPerf,
  },
  neither: {
    icon: "⬜",
    label: translate({ id: "comparison.arkhe.balanced.verdict.neither", message: "Neither" }),
    className: styles.verdictNeither,
  },
};

const weightOrder: CategoryName[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function BalancedTLDR(): React.ReactElement {
  const verdicts = useMemo(computeVerdicts, []);
  if (verdicts.length === 0) return <p>No data available.</p>;

  const total = verdicts.length;
  const bothCount = verdicts.filter(v => v.verdict === "both").length;
  const bundleOnlyCount = verdicts.filter(v => v.verdict === "bundle-only").length;
  const perfOnlyCount = verdicts.filter(v => v.verdict === "perf-only").length;
  const winSomething = bothCount + bundleOnlyCount + perfOnlyCount;
  const winRate = Math.round((winSomething / total) * 100);

  return (
    <p className={styles.tldr}>
      <strong>{translate(
        { id: "comparison.arkhe.balanced.tldr.highlight", message: "{winRate}% of utilities win on at least one axis" },
        { winRate: String(winRate) }
      )}</strong>
      {". "}
      <strong>{bothCount}</strong> {translate({ id: "comparison.arkhe.balanced.tldr.bothWin", message: "win on both bundle + perf," })}
      {" "}{bundleOnlyCount} {translate({ id: "comparison.arkhe.balanced.tldr.bundleOnly", message: "bundle only," })}
      {" "}{perfOnlyCount} {translate({ id: "comparison.arkhe.balanced.tldr.perfOnly", message: "perf only." })}
    </p>
  );
}

export function BalancedChart(): React.ReactElement {
  const verdicts = useMemo(computeVerdicts, []);
  if (verdicts.length === 0) return <p>No data available.</p>;

  const total = verdicts.length;
  const groups: { verdict: Verdict; count: number }[] = [
    { verdict: "both", count: verdicts.filter(v => v.verdict === "both").length },
    { verdict: "bundle-only", count: verdicts.filter(v => v.verdict === "bundle-only").length },
    { verdict: "perf-only", count: verdicts.filter(v => v.verdict === "perf-only").length },
    { verdict: "neither", count: verdicts.filter(v => v.verdict === "neither").length },
  ];

  const items: RankingItem[] = groups.map(g => ({
    key: g.verdict,
    label: `${verdictConfig[g.verdict].icon} ${verdictConfig[g.verdict].label}`,
    barPercent: total > 0 ? (g.count / total) * 100 : 0,
    isWinner: g.verdict === "both",
    stats: (
      <span>{g.count}/{total} ({Math.round((g.count / total) * 100)}%)</span>
    ),
  }));

  return (
    <>
      <RankingChart
        title={translate({ id: "comparison.arkhe.balanced.chart.title", message: "📊 Bundle + Performance" })}
        items={items}
      />
      <div className={styles.legend}>
        <strong>{translate({ id: "comparison.arkhe.balanced.legend.title", message: "Legend:" })}</strong>
        <ul>
          <li>✅ <strong>Bundle + Perf</strong>: {translate({ id: "comparison.arkhe.balanced.legend.both", message: "Arkhe wins (or is comparable) on both axes" })}</li>
          <li>📦 <strong>Bundle only</strong>: {translate({ id: "comparison.arkhe.balanced.legend.bundleOnly", message: "Smaller bundle, but not the fastest" })}</li>
          <li>⚡ <strong>Perf only</strong>: {translate({ id: "comparison.arkhe.balanced.legend.perfOnly", message: "Fastest, but not the smallest bundle" })}</li>
          <li>⬜ <strong>Neither</strong>: {translate({ id: "comparison.arkhe.balanced.legend.neither", message: "Another library wins on both" })}</li>
        </ul>
      </div>
    </>
  );
}

export function BalancedTable(): React.ReactElement {
  const verdicts = useMemo(computeVerdicts, []);
  if (verdicts.length === 0) return <p>No data available.</p>;

  const columns: Column<FunctionVerdict>[] = [
    {
      key: "name",
      header: translate({ id: "comparison.arkhe.balanced.header.function", message: "Function" }),
      sticky: true,
      width: "130px",
      minWidth: "130px",
      render: (v) => <strong>{v.name}</strong>,
    },
    {
      key: "matters",
      header: translate({ id: "comparison.arkhe.balanced.header.matters", message: "Perf matters?" }),
      width: "100px",
      className: styles.centerCell,
      render: (v) => {
        if (!v.weight) return <span className={styles.na}>-</span>;
        return (
          <span className={`${styles.weightBadge} ${styles[`weight${v.weight}`]}`}>
            {v.weight}
          </span>
        );
      },
    },
    {
      key: "bundle",
      header: translate({ id: "comparison.arkhe.balanced.header.bundle", message: "Bundle" }),
      width: "90px",
      className: styles.centerCell,
      render: (v) => (
        <span className={v.bundleWin ? styles.win : styles.lose}>
          {v.bundleWin ? "✅" : "❌"} {v.bundleDiff}
        </span>
      ),
    },
    {
      key: "perf",
      header: translate({ id: "comparison.arkhe.balanced.header.perf", message: "Perf" }),
      width: "90px",
      className: styles.centerCell,
      render: (v) => (
        <span className={v.perfWin ? styles.win : styles.lose}>
          {v.perfWin ? "✅" : "❌"} {v.perfDetail}
        </span>
      ),
    },
    {
      key: "verdict",
      header: translate({ id: "comparison.arkhe.balanced.header.verdict", message: "Verdict" }),
      width: "140px",
      render: (v) => {
        const cfg = verdictConfig[v.verdict];
        return (
          <span className={`${styles.verdictBadge} ${cfg.className}`}>
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
  ];

  const sorted = [...verdicts].sort((a, b) => {
    const wa = a.weight ? weightOrder.indexOf(a.weight) : 99;
    const wb = b.weight ? weightOrder.indexOf(b.weight) : 99;
    if (wa !== wb) return wa - wb;
    return a.name.localeCompare(b.name);
  });

  return (
    <Table
      columns={columns}
      data={sorted}
      keyExtractor={(v) => v.name}
      stickyHeader={true}
    />
  );
}
