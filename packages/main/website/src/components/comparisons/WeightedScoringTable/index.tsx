import React from "react";
import { translate } from "@docusaurus/Translate";
import { Table, Column } from "@site/src/components/shared/Table";
import styles from "./styles.module.css";

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface WeightedScoringRow {
  category: CategoryName;
  weight: string;
  perfMatters: string;
  description: string;
  examples: string;
}

const categoryColors: Record<CategoryName, string> = {
  CRITICAL: styles.categoryCritical,
  HIGH: styles.categoryHigh,
  MEDIUM: styles.categoryMedium,
  LOW: styles.categoryLow,
};

function getWeightedScoringData(): WeightedScoringRow[] {
  return [
    {
      category: "CRITICAL",
      weight: translate({ id: 'comparison.scoring.critical.weight', message: '5 pts' }),
      perfMatters: translate({ id: 'comparison.scoring.critical.perfMatters', message: 'A lot' }),
      description: translate({ id: 'comparison.scoring.critical.description', message: 'Hot path functions called in tight loops' }),
      examples: translate({ id: 'comparison.scoring.critical.examples', message: 'map, filter, reduce, groupBy, chunk' }),
    },
    {
      category: "HIGH",
      weight: translate({ id: 'comparison.scoring.high.weight', message: '3 pts' }),
      perfMatters: translate({ id: 'comparison.scoring.high.perfMatters', message: 'Yes' }),
      description: translate({ id: 'comparison.scoring.high.description', message: 'Frequently used utilities, but not in tight loops' }),
      examples: translate({ id: 'comparison.scoring.high.examples', message: 'get, set, pick, omit, cloneDeep' }),
    },
    {
      category: "MEDIUM",
      weight: translate({ id: 'comparison.scoring.medium.weight', message: '1 pt' }),
      perfMatters: translate({ id: 'comparison.scoring.medium.perfMatters', message: 'A bit' }),
      description: translate({ id: 'comparison.scoring.medium.description', message: 'Occasional utilities' }),
      examples: translate({ id: 'comparison.scoring.medium.examples', message: 'Type guards (isArray, isString), string formatting' }),
    },
    {
      category: "LOW",
      weight: translate({ id: 'comparison.scoring.low.weight', message: '0.5 pts' }),
      perfMatters: translate({ id: 'comparison.scoring.low.perfMatters', message: 'No' }),
      description: translate({ id: 'comparison.scoring.low.description', message: 'Setup-only functions where runtime perf is irrelevant' }),
      examples: translate({ id: 'comparison.scoring.low.examples', message: 'debounce, throttle, once, memoize' }),
    },
  ];
}

export function WeightedScoringTable(): React.ReactElement {
  const weightedScoringData = getWeightedScoringData();

  const columns: Column<WeightedScoringRow>[] = [
    {
      key: "category",
      header: translate({ id: 'comparison.scoring.header.category', message: 'Perf matters?' }),
      sticky: true,
      width: "120px",
      render: (row) => (
        <div>
          <span className={`${styles.categoryBadge} ${categoryColors[row.category]}`}>
            {row.category}
          </span>
          <div className={styles.perfMattersHint}>{row.perfMatters}</div>
        </div>
      ),
    },
    { 
      key: "weight", 
      header: translate({ id: 'comparison.scoring.header.weight', message: 'Weight' }), 
      width: "80px",
      render: (row) => (
        <span className={`${styles.categoryBadge} ${categoryColors[row.category]}`}>
          {row.weight}
        </span>
      ),
    },
    { key: "description", header: translate({ id: 'comparison.scoring.header.description', message: 'Description' }), width: "200px", wrap: true },
    { 
      key: "examples", 
      header: translate({ id: 'comparison.scoring.header.examples', message: 'Examples' }), 
      render: (row) => (
        <span style={{ fontFamily: "var(--ifm-font-family-monospace)", fontSize: "0.85em" }}>
          {row.examples}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.topAlign}>
      <Table
        columns={columns}
        data={weightedScoringData}
        keyExtractor={(row) => row.category}
        stickyHeader={false}
      />
    </div>
  );
}
