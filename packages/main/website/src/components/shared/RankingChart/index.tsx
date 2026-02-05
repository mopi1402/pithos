import React from "react";
import styles from "./styles.module.css";

export interface RankingItem {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Bar fill percentage (0-100) */
  barPercent: number;
  /** Whether this is the winner (gradient bar) */
  isWinner?: boolean;
  /** Medal emoji (auto-assigned if not provided) */
  medal?: string;
  /** Stats displayed on the right */
  stats: React.ReactNode;
  /** Whether this item is dimmed (e.g. unranked) */
  dimmed?: boolean;
}

interface RankingChartProps {
  /** Section title (e.g. "📊 Performance Summary") */
  title: React.ReactNode;
  /** Optional subtitle / explanation */
  subtitle?: React.ReactNode;
  /** Optional winner announcement banner */
  announcement?: React.ReactNode;
  /** Ranking items to display */
  items: RankingItem[];
  /** Optional footer content (e.g. category breakdown) */
  children?: React.ReactNode;
}

function getMedal(index: number): string {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "";
}

export function RankingChart({
  title,
  subtitle,
  announcement,
  items,
  children,
}: RankingChartProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {announcement && <p className={styles.announcement}>{announcement}</p>}
      <div className={styles.grid}>
        {items.map((item, i) => (
          <div key={item.key} className={`${styles.row} ${item.dimmed ? styles.dimmed : ""}`}>
            <div className={styles.label}>
              <span className={styles.medal}>{item.medal ?? getMedal(i)}</span>
              <span className={styles.name}>{item.label}</span>
            </div>
            <div className={styles.bar}>
              <div
                className={`${styles.barFill} ${item.isWinner ? styles.winner : ""}`}
                style={{ width: `${item.barPercent}%` }}
              />
            </div>
            <div className={styles.stats}>{item.stats}</div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
