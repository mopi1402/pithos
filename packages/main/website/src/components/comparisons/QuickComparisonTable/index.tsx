import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { Table, Column } from "@site/src/components/shared/Table";
import ModuleName from "@site/src/components/shared/badges/ModuleName";
import {
  calculateArkheComparison,
  calculateKanonComparison,
  calculateZygosComparison,
  type ModuleComparison,
} from "./calculations";

export function QuickComparisonTable(): React.ReactElement {
  const data: ModuleComparison[] = [
    calculateArkheComparison(),
    calculateKanonComparison(),
    calculateZygosComparison(),
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
