import React, { type ReactNode } from "react";
import { FilterableTableProvider } from "./FilterableTableContext";
import { FilterToggle } from "./FilterToggle";

interface FilterableTableProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides filtering capability for tables.
 * 
 * Usage in MDX:
 * ```mdx
 * <FilterableTable>
 * 
 * | Column1 | Column2 |
 * |---------|---------|
 * | Normal row | data |
 * | ~Edge case | data |
 * 
 * </FilterableTable>
 * ```
 * 
 * Rows starting with `~` in the first column are considered "edge cases"
 * and will be hidden by default. Users can toggle their visibility.
 */
export function FilterableTable({ children }: FilterableTableProps): React.ReactElement {
  return (
    <FilterableTableProvider>
      <FilterToggle />
      {children}
    </FilterableTableProvider>
  );
}
