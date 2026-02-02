import React from "react";
import { Table, Column } from "../Table";

// Import benchmark and bundle data
let arkheBenchmark: {
  scenarios: { results: { library: string; opsPerSecond: number }[] }[];
} | null = null;
let kanonBenchmark: {
  scenarios: { results: { library: string; opsPerSecond: number }[] }[];
} | null = null;
let zygosBenchmark: {
  scenarios: { name: string; results: { library: string; opsPerSecond: number }[] }[];
} | null = null;
let arkheBundleSizes: {
  modules: {
    arkhe: {
      results: { utilName: string; library: string; gzipBytes: number | null }[];
    };
  };
} | null = null;
let kanonBundleSizes: {
  results: { variant: string; test: string; gzipBytes: number }[];
} | null = null;

try {
  arkheBenchmark = require("../../data/arkhe-benchmark.json");
  kanonBenchmark = require("../../data/kanon-benchmark-realworld.json");
  zygosBenchmark = require("../../data/zygos-benchmark.json");
  arkheBundleSizes = require("../../data/arkhe-bundle-sizes.json");
  kanonBundleSizes = require("../../data/bundle-sizes.json");
} catch {
  // Data not available
}

// Hardcoded values for Zygos bundle size (no bundle size benchmarks yet)
const NEVERTHROW_SIZE_KB = 6;
const ZYGOS_SIZE_KB = 2;

interface ModuleComparison {
  module: string;
  competitor: string;
  bundleSize: string;
  performance: string;
}

function calculateArkheComparison(): ModuleComparison {
  let bundleSize = "~93% smaller";
  let performance = "N/A";

  if (arkheBundleSizes?.modules?.arkhe?.results) {
    const results = arkheBundleSizes.modules.arkhe.results;
    const utils = new Set(results.map(r => r.utilName));
    let totalRatio = 0;
    let count = 0;

    for (const util of utils) {
      const arkheSize = results.find(
        r => r.utilName === util && r.library === "pithos" && r.gzipBytes
      )?.gzipBytes;
      const lodashSize = results.find(
        r => r.utilName === util && r.library === "lodash" && r.gzipBytes
      )?.gzipBytes;

      if (arkheSize && lodashSize && arkheSize > 0) {
        totalRatio += lodashSize / arkheSize;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      bundleSize = `${avgRatio.toFixed(1)}x smaller`;
    }
  }

  if (arkheBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of arkheBenchmark.scenarios) {
      const arkheOps = scenario.results.find(r => r.library === "arkhe")?.opsPerSecond;
      const lodashOps = scenario.results.find(r => r.library === "lodash-es")?.opsPerSecond;

      if (arkheOps && lodashOps && lodashOps > 0) {
        totalRatio += arkheOps / lodashOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      performance = avgRatio >= 1 
        ? `${avgRatio.toFixed(1)}x faster` 
        : `${(1 / avgRatio).toFixed(1)}x slower`;
    }
  }

  return {
    module: "Arkhe",
    competitor: "Lodash",
    bundleSize,
    performance,
  };
}

function calculateKanonComparison(): ModuleComparison {
  let bundleSize = "~74% smaller";
  let performance = "N/A";

  if (kanonBundleSizes?.results) {
    const kanonFullApp = kanonBundleSizes.results.find(
      r => r.variant === "kanon" && r.test === "full-app"
    );
    const zodFullApp = kanonBundleSizes.results.find(
      r => r.variant === "zod4-classic" && r.test === "full-app"
    );

    if (kanonFullApp && zodFullApp && kanonFullApp.gzipBytes > 0) {
      const ratio = zodFullApp.gzipBytes / kanonFullApp.gzipBytes;
      bundleSize = `${ratio.toFixed(1)}x smaller`;
    }
  }

  if (kanonBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of kanonBenchmark.scenarios) {
      const kanonOps = scenario.results.find(r => r.library === "@kanon/JIT")?.opsPerSecond;
      const zodOps = scenario.results.find(r => r.library === "Zod")?.opsPerSecond;

      if (kanonOps && zodOps && zodOps > 0) {
        totalRatio += kanonOps / zodOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      performance = `${avgRatio.toFixed(1)}x faster`;
    }
  }

  return {
    module: "Kanon",
    competitor: "Zod",
    bundleSize,
    performance,
  };
}

function calculateZygosComparison(): ModuleComparison {
  const ratio = NEVERTHROW_SIZE_KB / ZYGOS_SIZE_KB;
  let performance = "Similar";

  // Calculate performance from benchmark data (Result scenarios only)
  if (zygosBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of zygosBenchmark.scenarios) {
      // Only count Result benchmarks (not Option vs fp-ts)
      if (!scenario.name.startsWith("result/")) continue;

      const zygosOps = scenario.results.find(r => r.library === "zygos")?.opsPerSecond;
      const neverthrowOps = scenario.results.find(r => r.library === "neverthrow")?.opsPerSecond;

      if (zygosOps && neverthrowOps && neverthrowOps > 0) {
        totalRatio += zygosOps / neverthrowOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      if (avgRatio >= 1.1) {
        performance = `${avgRatio.toFixed(1)}x faster`;
      } else if (avgRatio <= 0.9) {
        performance = `${(1 / avgRatio).toFixed(1)}x slower`;
      } else {
        performance = "Similar";
      }
    }
  }

  return {
    module: "Zygos",
    competitor: "Neverthrow",
    bundleSize: `${ratio.toFixed(1)}x smaller`,
    performance,
  };
}

export function QuickComparisonTable(): React.ReactElement {
  const data: ModuleComparison[] = [
    calculateArkheComparison(),
    calculateKanonComparison(),
    calculateZygosComparison(),
  ];

  const columns: Column<ModuleComparison>[] = [
    {
      key: "module",
      header: "Module",
      sticky: true,
      width: "100px",
      render: (row) => <strong>{row.module}</strong>,
    },
    {
      key: "competitor",
      header: "vs",
      width: "120px",
    },
    {
      key: "bundleSize",
      header: "Bundle Size (average)",
      width: "160px",
      render: (row) => <strong>{row.bundleSize}</strong>,
    },
    {
      key: "performance",
      header: "Performance (average)",
      width: "170px",
      render: (row) => <strong>{row.performance}</strong>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      keyExtractor={(row) => row.module}
      stickyHeader={false}
    />
  );
}
