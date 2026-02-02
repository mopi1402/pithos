import React, { createContext, useContext, type ReactNode } from "react";

export interface ColumnConfig {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  hideHeader?: boolean;
}

export interface TableConfigValue {
  columns?: Record<string, ColumnConfig>;
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
}

const TableConfigContext = createContext<TableConfigValue | null>(null);

interface TableConfigProps {
  columns?: Record<string, ColumnConfig>;
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
  children: ReactNode;
}

/**
 * Wrapper component to provide configuration for MDX tables.
 * 
 * @example
 * ```mdx
 * <TableConfig columns={{ "Status": { width: "20px", hideHeader: true } }}>
 * 
 * | !Pithos | !Status | Lodash |
 * |---------|---------|--------|
 * | `chunk` | ✅ | `_.chunk` |
 * 
 * </TableConfig>
 * ```
 */
export function TableConfig({ columns, stickyHeader, stickyHeaderOffset, children }: TableConfigProps): React.ReactElement {
  const parentConfig = useContext(TableConfigContext);
  
  // Merge with parent config (child values override parent)
  const mergedValue: TableConfigValue = {
    ...parentConfig,
    ...(columns !== undefined && { columns }),
    ...(stickyHeader !== undefined && { stickyHeader }),
    ...(stickyHeaderOffset !== undefined && { stickyHeaderOffset }),
  };
  
  return (
    <TableConfigContext.Provider value={mergedValue}>
      {children}
    </TableConfigContext.Provider>
  );
}

export function useTableConfig(): TableConfigValue | null {
  return useContext(TableConfigContext);
}
