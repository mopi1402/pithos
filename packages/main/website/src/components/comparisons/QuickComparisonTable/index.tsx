import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { Table, Column } from "@site/src/components/shared/Table";
import ModuleName from "@site/src/components/shared/badges/ModuleName";
import type { ModuleComparison } from "./calculations";
import {
  ARKHE_BUNDLE_RATIO, ARKHE_PERF_RATIO,
  KANON_BUNDLE_RATIO, KANON_JIT_RATIO,
  ZYGOS_BUNDLE_RATIO, ZYGOS_PERF_RATIO,
} from "@site/src/data/generated/pre-computed-comparisons";

function fmtSmaller(ratio: number | null): string {
  if (ratio == null) return translate({ id: "comparison.quick.result.na", message: "N/A" });
  return translate({ id: "comparison.quick.result.smaller", message: "{ratio}x smaller" }, { ratio: ratio.toFixed(1) });
}

function fmtPerf(ratio: number | null): string {
  if (ratio == null) return translate({ id: "comparison.quick.result.na", message: "N/A" });
  if (ratio >= 1) return translate({ id: "comparison.quick.result.faster", message: "{ratio}x faster" }, { ratio: ratio.toFixed(1) });
  return translate({ id: "comparison.quick.result.slower", message: "{ratio}x slower" }, { ratio: (1 / ratio).toFixed(1) });
}

function fmtZygosPerf(ratio: number | null): string {
  if (ratio == null) return translate({ id: "comparison.quick.result.similar", message: "Similar" });
  if (ratio >= 1.1) return translate({ id: "comparison.quick.result.faster", message: "{ratio}x faster" }, { ratio: ratio.toFixed(1) });
  if (ratio <= 0.9) return translate({ id: "comparison.quick.result.slower", message: "{ratio}x slower" }, { ratio: (1 / ratio).toFixed(1) });
  return translate({ id: "comparison.quick.result.similar", message: "Similar" });
}

export function QuickComparisonTable(): React.ReactElement {
  const data: ModuleComparison[] = [
    {
      module: "Arkhe", competitor: "Lodash",
      bundleSize: fmtSmaller(ARKHE_BUNDLE_RATIO), bundleSizeLink: "/comparisons/arkhe/bundle-size/",
      performance: fmtPerf(ARKHE_PERF_RATIO), performanceLink: "/comparisons/arkhe/performances/",
    },
    {
      module: "Kanon", competitor: "Zod",
      bundleSize: fmtSmaller(KANON_BUNDLE_RATIO), bundleSizeLink: "/comparisons/kanon/bundle-size/",
      performance: fmtPerf(KANON_JIT_RATIO), performanceLink: "/comparisons/kanon/performances/",
    },
    {
      module: "Zygos", competitor: "Neverthrow",
      bundleSize: fmtSmaller(ZYGOS_BUNDLE_RATIO), bundleSizeLink: "/comparisons/zygos/bundle-size/",
      performance: fmtZygosPerf(ZYGOS_PERF_RATIO), performanceLink: "/comparisons/zygos/performances/",
    },
  ];

  const columns: Column<ModuleComparison>[] = [
    {
      key: "module",
      header: translate({ id: 'comparison.quick.header.module', message: 'Module' }),
      sticky: true,
      width: "100px",
      render: (row) => <ModuleName name={row.module} />,
    },
    {
      key: "competitor",
      header: translate({ id: 'comparison.quick.header.vs', message: 'vs' }),
      width: "120px",
    },
    {
      key: "bundleSize",
      header: translate({ id: 'comparison.quick.header.bundleSize', message: 'Bundle Size (average)' }),
      width: "160px",
      render: (row) => <Link to={row.bundleSizeLink}><strong>{row.bundleSize}</strong></Link>,
    },
    {
      key: "performance",
      header: translate({ id: 'comparison.quick.header.performance', message: 'Performance (average)' }),
      width: "170px",
      render: (row) => <Link to={row.performanceLink}><strong>{row.performance}</strong></Link>,
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
