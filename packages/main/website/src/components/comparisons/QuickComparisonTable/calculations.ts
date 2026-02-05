import { translate } from "@docusaurus/Translate";
import type { BenchmarkReport } from "@site/src/components/comparisons/BenchmarkTable/types";
import type { BundleData as KanonBundleData } from "@site/src/components/comparisons/BundleSizeTable/types";
import type { BundleData as ArkheBundleData } from "@site/src/components/comparisons/arkhe/BundleSizeTable/types";
import type { BundleData as ZygosBundleData } from "@site/src/components/comparisons/zygos/BundleSizeTable/types";

// Import benchmark and bundle data
let arkheBenchmark: BenchmarkReport | null = null;
let kanonBenchmark: BenchmarkReport | null = null;
let zygosBenchmark: BenchmarkReport | null = null;
let arkheBundleSizes: ArkheBundleData | null = null;
let kanonBundleSizes: KanonBundleData | null = null;
let zygosBundleSizes: ZygosBundleData | null = null;

try {
  arkheBenchmark = require("../../../data/benchmarks/arkhe-benchmark.json");
  kanonBenchmark = require("../../../data/benchmarks/kanon-benchmark-realworld.json");
  zygosBenchmark = require("../../../data/benchmarks/zygos-benchmark.json");
  arkheBundleSizes = require("../../../data/comparisons/arkhe-bundle-sizes.json");
  kanonBundleSizes = require("../../../data/generated/kanon-bundle-sizes.json");
  zygosBundleSizes = require("../../../data/comparisons/zygos-bundle-sizes.json");
} catch {
  // Data not available
}

export interface ModuleComparison {
  module: string;
  competitor: string;
  bundleSize: string;
  bundleSizeLink: string;
  performance: string;
  performanceLink: string;
}

export function calculateArkheComparison(): ModuleComparison {
  let bundleSize = translate(
    { id: "comparison.quick.result.percentSmaller", message: "~{percent}% smaller" },
    { percent: "93" },
  );
  let performance = translate({
    id: "comparison.quick.result.na",
    message: "N/A",
  });

  if (arkheBundleSizes?.modules?.arkhe?.results) {
    const results = arkheBundleSizes.modules.arkhe.results;
    const utils = new Set(results.map((r) => r.utilName));
    let totalRatio = 0;
    let count = 0;

    for (const util of utils) {
      const arkheSize = results.find(
        (r) => r.utilName === util && r.library === "pithos" && r.gzipBytes,
      )?.gzipBytes;
      const lodashSize = results.find(
        (r) => r.utilName === util && r.library === "lodash" && r.gzipBytes,
      )?.gzipBytes;

      if (arkheSize && lodashSize && arkheSize > 0) {
        totalRatio += lodashSize / arkheSize;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      bundleSize = translate(
        { id: "comparison.quick.result.smaller", message: "{ratio}x smaller" },
        { ratio: avgRatio.toFixed(1) },
      );
    }
  }

  if (arkheBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of arkheBenchmark.scenarios) {
      const arkheOps = scenario.results.find(
        (r) => r.library === "arkhe",
      )?.opsPerSecond;
      const lodashOps = scenario.results.find(
        (r) => r.library === "lodash-es",
      )?.opsPerSecond;

      if (arkheOps && lodashOps && lodashOps > 0) {
        totalRatio += arkheOps / lodashOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      performance =
        avgRatio >= 1
          ? translate(
              { id: "comparison.quick.result.faster", message: "{ratio}x faster" },
              { ratio: avgRatio.toFixed(1) },
            )
          : translate(
              { id: "comparison.quick.result.slower", message: "{ratio}x slower" },
              { ratio: (1 / avgRatio).toFixed(1) },
            );
    }
  }

  return {
    module: "Arkhe",
    competitor: "Lodash",
    bundleSize,
    bundleSizeLink: "/comparisons/arkhe/bundle-size/",
    performance,
    performanceLink: "/comparisons/arkhe/performances/",
  };
}

export function calculateKanonComparison(): ModuleComparison {
  let bundleSize = translate(
    { id: "comparison.quick.result.percentSmaller", message: "~{percent}% smaller" },
    { percent: "74" },
  );
  let performance = translate({
    id: "comparison.quick.result.na",
    message: "N/A",
  });

  if (kanonBundleSizes?.results) {
    const kanonFullApp = kanonBundleSizes.results.find(
      (r) => r.variant === "kanon" && r.test === "full-app",
    );
    const zodFullApp = kanonBundleSizes.results.find(
      (r) => r.variant === "zod4-classic" && r.test === "full-app",
    );

    if (kanonFullApp && zodFullApp && kanonFullApp.gzipBytes > 0) {
      const ratio = zodFullApp.gzipBytes / kanonFullApp.gzipBytes;
      bundleSize = translate(
        { id: "comparison.quick.result.smaller", message: "{ratio}x smaller" },
        { ratio: ratio.toFixed(1) },
      );
    }
  }

  if (kanonBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of kanonBenchmark.scenarios) {
      const kanonOps = scenario.results.find(
        (r) => r.library === "@kanon/JIT",
      )?.opsPerSecond;
      const zodOps = scenario.results.find(
        (r) => r.library === "Zod",
      )?.opsPerSecond;

      if (kanonOps && zodOps && zodOps > 0) {
        totalRatio += kanonOps / zodOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      performance = translate(
        { id: "comparison.quick.result.faster", message: "{ratio}x faster" },
        { ratio: avgRatio.toFixed(1) },
      );
    }
  }

  return {
    module: "Kanon",
    competitor: "Zod",
    bundleSize,
    bundleSizeLink: "/comparisons/kanon/bundle-size/",
    performance,
    performanceLink: "/comparisons/kanon/performances/",
  };
}

export function calculateZygosComparison(): ModuleComparison {
  let bundleSize = translate(
    { id: "comparison.quick.result.percentSmaller", message: "~{percent}% smaller" },
    { percent: "67" },
  );
  let performance = translate({
    id: "comparison.quick.result.similar",
    message: "Similar",
  });

  // Calculate bundle size from generated data (result-pattern modules only, vs neverthrow)
  if (zygosBundleSizes?.results) {
    const resultModules = ["result", "result-async", "result-all", "safe"];
    let totalRatio = 0;
    let count = 0;

    for (const mod of resultModules) {
      const zygosSize = zygosBundleSizes.results.find(
        (r) => r.variant === "zygos" && r.module === mod && r.category === "result-pattern" && r.gzipBytes,
      )?.gzipBytes;
      const neverthrowSize = zygosBundleSizes.results.find(
        (r) => r.variant === "neverthrow" && r.module === mod && r.category === "result-pattern" && r.gzipBytes,
      )?.gzipBytes;

      if (zygosSize && neverthrowSize && zygosSize > 0) {
        totalRatio += neverthrowSize / zygosSize;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      bundleSize = translate(
        { id: "comparison.quick.result.smaller", message: "{ratio}x smaller" },
        { ratio: avgRatio.toFixed(1) },
      );
    }
  }

  // Calculate performance from benchmark data (Result scenarios only)
  if (zygosBenchmark?.scenarios) {
    let totalRatio = 0;
    let count = 0;

    for (const scenario of zygosBenchmark.scenarios) {
      // Only count Result benchmarks (not Option vs fp-ts)
      if (!scenario.name.startsWith("result/")) continue;

      const zygosOps = scenario.results.find(
        (r) => r.library === "zygos",
      )?.opsPerSecond;
      const neverthrowOps = scenario.results.find(
        (r) => r.library === "neverthrow",
      )?.opsPerSecond;

      if (zygosOps && neverthrowOps && neverthrowOps > 0) {
        totalRatio += zygosOps / neverthrowOps;
        count++;
      }
    }

    if (count > 0) {
      const avgRatio = totalRatio / count;
      if (avgRatio >= 1.1) {
        performance = translate(
          { id: "comparison.quick.result.faster", message: "{ratio}x faster" },
          { ratio: avgRatio.toFixed(1) },
        );
      } else if (avgRatio <= 0.9) {
        performance = translate(
          { id: "comparison.quick.result.slower", message: "{ratio}x slower" },
          { ratio: (1 / avgRatio).toFixed(1) },
        );
      } else {
        performance = translate({
          id: "comparison.quick.result.similar",
          message: "Similar",
        });
      }
    }
  }

  return {
    module: "Zygos",
    competitor: "Neverthrow",
    bundleSize,
    bundleSizeLink: "/comparisons/zygos/bundle-size/",
    performance,
    performanceLink: "/comparisons/zygos/performances/",
  };
}
