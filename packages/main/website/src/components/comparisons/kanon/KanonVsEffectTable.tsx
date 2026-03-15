import React from "react";
import {
  BenchmarkResultsTable,
  LibraryFilterProvider,
} from "@site/src/components/comparisons/BenchmarkTable";
import { kanonConfig, type KanonCategory } from "./PerformanceTable/config";
import type { ModuleConfig } from "@site/src/components/comparisons/BenchmarkTable";

const VISIBLE_LIBS = ["@kanon/V3.0", "@kanon/JIT", "Effect"];

const vsEffectConfig: ModuleConfig<KanonCategory> = {
  ...kanonConfig,
  benchmarkData: kanonConfig.benchmarkData
    ? {
        ...kanonConfig.benchmarkData,
        libraries: kanonConfig.benchmarkData.libraries.filter((lib) =>
          VISIBLE_LIBS.includes(lib)
        ),
      }
    : null,
  excludedLibraries: [],
  stickyHeaderOffset: 60,
};

const filterGroups = {
  all: {
    label: "All",
    description: "All libraries",
    libraries: VISIBLE_LIBS,
  },
};

export default function KanonVsEffectTable(): React.ReactElement {
  if (!vsEffectConfig.benchmarkData) {
    return <p>Benchmark data not available. Run <code>pnpm doc:generate:kanon:benchmarks-results</code> to generate.</p>;
  }

  const table = <BenchmarkResultsTable config={vsEffectConfig} />;

  return (
    <LibraryFilterProvider groups={filterGroups} allLibraries={VISIBLE_LIBS} children={table} />
  );
}
