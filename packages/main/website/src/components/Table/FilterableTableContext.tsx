import React, { createContext, useContext, useState, type ReactNode } from "react";

export const FILTER_TAGS = ["native", "niche", "mutable"] as const;
export type FilterTag = (typeof FILTER_TAGS)[number];

/** Regex pattern to match filter tags at the start of a string */
export const FILTER_TAG_PATTERN = new RegExp(`^~(${FILTER_TAGS.join("|")})`);

export interface FilterableTableContextValue {
  visibleTags: Set<FilterTag>;
  toggleTag: (tag: FilterTag) => void;
}

const FilterableTableContext = createContext<FilterableTableContextValue | null>(null);

interface FilterableTableProviderProps {
  children: ReactNode;
}

/**
 * Provider component for filterable table state.
 * Manages the visibility of tagged rows (native polyfills, niche functions, mutable functions).
 */
export function FilterableTableProvider({ children }: FilterableTableProviderProps): React.ReactElement {
  const [visibleTags, setVisibleTags] = useState<Set<FilterTag>>(new Set());

  const toggleTag = (tag: FilterTag) => {
    setVisibleTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  return (
    <FilterableTableContext.Provider value={{ visibleTags, toggleTag }}>
      {children}
    </FilterableTableContext.Provider>
  );
}

export function useFilterableTable(): FilterableTableContextValue | null {
  return useContext(FilterableTableContext);
}
