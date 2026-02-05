import React from "react";
import { translate } from "@docusaurus/Translate";
import { useFilterableTable, type FilterTag } from "./FilterableTableContext";
import { StickyBar } from "../StickyBar";
import styles from "./styles.module.css";

const FILTER_OPTIONS: { tag: FilterTag; label: string; description: string }[] = [
  {
    tag: "native",
    label: translate({ id: "comparison.filter.native.label", message: "Native / One-liners" }),
    description: translate({ id: "comparison.filter.native.description", message: "Functions with native JS equivalents" }),
  },
  {
    tag: "niche",
    label: translate({ id: "comparison.filter.niche.label", message: "Niche / Rare" }),
    description: translate({ id: "comparison.filter.niche.description", message: "Rarely used or very specific functions" }),
  },
  {
    tag: "mutable",
    label: translate({ id: "comparison.filter.mutable.label", message: "Mutable" }),
    description: translate({ id: "comparison.filter.mutable.description", message: "Functions that encourage mutation" }),
  },
];

/**
 * Toggle component to show/hide filtered function categories.
 */
export function FilterToggle(): React.ReactElement | null {
  const context = useFilterableTable();
  
  if (!context) {
    return null;
  }

  const { visibleTags, toggleTag } = context;

  return (
    <StickyBar>
      <div className={styles.filterToggleGroup}>
        <span className={styles.filterLabel}>
          {translate({ id: "comparison.filter.show", message: "Show:" })}
        </span>
        <div className={styles.filterToggleList}>
          {FILTER_OPTIONS.map(({ tag, label, description }) => (
            <label key={tag} className={styles.filterToggle} title={description}>
              <input
                type="checkbox"
                checked={visibleTags.has(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </StickyBar>
  );
}
