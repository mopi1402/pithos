import React from "react";
import { translate } from "@docusaurus/Translate";
import {
  ModuleConfig,
  BenchmarkReport,
} from "@site/src/components/comparisons/BenchmarkTable";
import styles from "./styles.module.css";

let benchmarkData: BenchmarkReport | null = null;
try {
  benchmarkData = require("@site/src/data/benchmarks/zygos-benchmark.json");
} catch {
  benchmarkData = null;
}

const libraryDescriptions: Record<string, string> = {
  zygos: translate({ id: 'comparison.zygos.lib.zygos', message: 'Pithos Result/Option module (lightweight, tree-shakeable)' }),
  neverthrow: translate({ id: 'comparison.zygos.lib.neverthrow', message: 'Popular Result library for TypeScript' }),
  "fp-ts": translate({ id: 'comparison.zygos.lib.fpTs', message: 'Functional programming library with Option/Either' }),
};

// Compute fp-ts variant libraries to exclude from Result table
const fpTsLibraries = benchmarkData
  ? benchmarkData.libraries.filter((lib) => lib.startsWith("fp-ts"))
  : [];

export const zygosResultConfig: ModuleConfig<string> = {
  name: "zygos",
  primaryLibrary: "zygos",
  benchmarkData,
  scenarioFilter: (s) => s.name.startsWith("result/"),
  formatTestName: (name) => name.replace("result/", ""),
  weights: {},
  categoryLabels: {},
  functionToCategory: {},
  categoryOrder: [],
  libraryDescriptions,
  excludedLibraries: fpTsLibraries,
  tldrContent: (data: BenchmarkReport) => {
    const resultScenarios = data.scenarios.filter((s) =>
      s.name.startsWith("result/")
    );
    const zygosWins = resultScenarios.filter((s) =>
      s.results.find((r) => r.library === "zygos")?.isFastest
    ).length;
    const winRate = Math.round((zygosWins / resultScenarios.length) * 100);

    const highlight = translate(
      { id: 'comparison.zygos.tldr.result.highlight', message: 'Zygos wins {winRate}% of Result benchmarks vs Neverthrow.' },
      { winRate: String(winRate) }
    );
    const fullText = translate(
      { id: 'comparison.zygos.tldr.result', message: 'Zygos wins {winRate}% of Result benchmarks vs Neverthrow. Up to 3x faster on object creation, 2-3x faster on chained operations. Similar performance on simple operations like isOk() and unwrapOr().' },
      { winRate: String(winRate) }
    );
    const rest = fullText.slice(highlight.length).trimStart();

    return (
      <>
        <strong className={styles.highlight}>
          {highlight}
        </strong>{" "}
        {rest}
      </>
    );
  },
  generateCommand: "pnpm doc:generate:zygos:benchmarks-results",
};

export const zygosOptionConfig: ModuleConfig<string> = {
  name: "zygos",
  primaryLibrary: "zygos",
  benchmarkData,
  scenarioFilter: (s) => s.name.startsWith("option/"),
  formatTestName: (name) => name.replace("option/", ""),
  weights: {},
  categoryLabels: {},
  functionToCategory: {},
  categoryOrder: [],
  libraryDescriptions,
  excludedLibraries: ["neverthrow"],
  tldrContent: (data: BenchmarkReport) => {
    const optionScenarios = data.scenarios.filter((s) =>
      s.name.startsWith("option/")
    );
    const zygosWins = optionScenarios.filter((s) =>
      s.results.find((r) => r.library === "zygos")?.isFastest
    ).length;
    const winRate = Math.round((zygosWins / optionScenarios.length) * 100);

    const highlight = translate(
      { id: 'comparison.zygos.tldr.option.highlight', message: 'Zygos wins {winRate}% of Option benchmarks vs fp-ts.' },
      { winRate: String(winRate) }
    );
    const fullText = translate(
      { id: 'comparison.zygos.tldr.option', message: 'Zygos wins {winRate}% of Option benchmarks vs fp-ts. Lightweight and tree-shakeable alternative to fp-ts Option.' },
      { winRate: String(winRate) }
    );
    const rest = fullText.slice(highlight.length).trimStart();

    return (
      <>
        <strong className={styles.highlight}>
          {highlight}
        </strong>{" "}
        {rest}
      </>
    );
  },
  generateCommand: "pnpm doc:generate:zygos:benchmarks-results",
};
