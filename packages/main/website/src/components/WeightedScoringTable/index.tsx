import React from "react";
import { Table, Column } from "../Table";
import styles from "./styles.module.css";

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface WeightedScoringRow {
  category: CategoryName;
  weight: string;
  description: string;
  examples: string;
}

const categoryColors: Record<CategoryName, string> = {
  CRITICAL: styles.categoryCritical,
  HIGH: styles.categoryHigh,
  MEDIUM: styles.categoryMedium,
  LOW: styles.categoryLow,
};

const weightedScoringData: WeightedScoringRow[] = [
  { category: "CRITICAL", weight: "5 pts", description: "Hot path functions called in tight loops", examples: "map, filter, reduce, groupBy, chunk" },
  { category: "HIGH", weight: "3 pts", description: "Frequently used utilities, but not in tight loops", examples: "get, set, pick, omit, cloneDeep" },
  { category: "MEDIUM", weight: "1 pt", description: "Occasional utilities", examples: "Type guards (isArray, isString), string formatting" },
  { category: "LOW", weight: "0.5 pts", description: "Setup-only functions where runtime perf is irrelevant", examples: "debounce, throttle, once, memoize" },
];

export function WeightedScoringTable(): React.ReactElement {
  const columns: Column<WeightedScoringRow>[] = [
    {
      key: "category",
      header: "Category",
      sticky: true,
      width: "120px",
      render: (row) => (
        <span className={`${styles.categoryBadge} ${categoryColors[row.category]}`}>
          {row.category}
        </span>
      ),
    },
    { key: "weight", header: "Weight", width: "80px" },
    { key: "description", header: "Description", width: "200px", wrap: true },
    { 
      key: "examples", 
      header: "Examples", 
      render: (row) => (
        <span style={{ fontFamily: "var(--ifm-font-family-monospace)", fontSize: "0.85em" }}>
          {row.examples}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={weightedScoringData}
      keyExtractor={(row) => row.category}
      stickyHeader={false}
    />
  );
}
