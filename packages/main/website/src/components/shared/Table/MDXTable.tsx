import React, {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { Table, type Column } from "./index";
import { useTableConfig } from "./TableConfigContext";
import { useFilterableTable, FILTER_TAG_PATTERN, type FilterTag } from "./FilterableTableContext";
import { extractTextFromNode, removePrefixFromNode } from "@site/src/utils/text";

interface MDXTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

/**
 * Wrapper component that converts standard HTML table structure to the Table component.
 * This allows using standard Markdown tables that are automatically converted to the custom Table component.
 *
 * The highlighted header is enabled by default for all Markdown tables.
 * To disable it, add the `no-highlight-header` class to the table.
 *
 * Special column prefixes:
 * - Use `!` as the first character in a header to make that column sticky (e.g., `| !Module | Description |`)
 */
export function MDXTable({ children, className }: MDXTableProps): ReactElement {
  // Enable highlighted header by default for all Markdown tables
  // Can be disabled by adding "no-highlight-header" class
  const highlightedHeader = className?.includes("no-highlight-header") !== true;

  // Get config from context (if wrapped in TableConfig)
  const tableConfig = useTableConfig();
  
  // Get filterable table context (if wrapped in FilterableTableProvider)
  const filterableContext = useFilterableTable();

  // Find thead and tbody from children
  const childrenArray = React.Children.toArray(children);
  const theadElement = childrenArray.find(
    (child): child is ReactElement =>
      React.isValidElement(child) && child.type === "thead"
  );
  const tbodyElement = childrenArray.find(
    (child): child is ReactElement =>
      React.isValidElement(child) && child.type === "tbody"
  );

  // Extract headers from thead and detect special prefixes
  const headers: Array<{
    content: ReactNode;
    sticky?: boolean;
  }> = [];
  if (theadElement && React.isValidElement(theadElement)) {
    const theadChildren = React.Children.toArray(
      (theadElement as ReactElement<ComponentProps<"thead">>).props.children
    );
    const headerRow = theadChildren.find(
      (child): child is ReactElement<ComponentProps<"tr">> =>
        React.isValidElement(child) && child.type === "tr"
    );

    if (headerRow && React.isValidElement(headerRow)) {
      const headerCells = React.Children.toArray(headerRow.props.children);
      headerCells.forEach((cell) => {
        if (React.isValidElement(cell) && cell.type === "th") {
          const thElement = cell as ReactElement<ComponentProps<"th">>;
          const headerContent = thElement.props.children;

          // Check if header starts with "!" for sticky column
          const headerText = extractTextFromNode(headerContent);
          const isSticky = headerText.trim().startsWith("!");

          // Remove "!" prefix if present
          const processedHeader = isSticky
            ? removePrefixFromNode(headerContent, "!")
            : headerContent;

          headers.push({
            content: processedHeader,
            sticky: isSticky,
          });
        }
      });
    }
  }

  // Extract data from tbody
  interface RowWithMeta {
    data: Record<string, ReactNode>;
    filterTag?: FilterTag;
  }
  const rows: RowWithMeta[] = [];
  
  if (tbodyElement && React.isValidElement(tbodyElement)) {
    const tbodyChildren = React.Children.toArray(
      (tbodyElement as ReactElement<ComponentProps<"tbody">>).props.children
    );
    tbodyChildren.forEach((row) => {
      if (React.isValidElement(row) && row.type === "tr") {
        const trElement = row as ReactElement<ComponentProps<"tr">>;
        const rowData: Record<string, ReactNode> = {};
        const cells = React.Children.toArray(trElement.props.children);
        let filterTag: FilterTag | undefined;
        
        cells.forEach((cell, index) => {
          if (React.isValidElement(cell) && cell.type === "td") {
            const tdElement = cell as ReactElement<ComponentProps<"td">>;
            const key = `col${index}`;
            let cellContent = tdElement.props.children;
            
            // Check if first cell starts with "~tag" for filtering
            if (index === 0) {
              const cellText = extractTextFromNode(cellContent);
              const tagMatch = cellText.trim().match(FILTER_TAG_PATTERN);
              if (tagMatch) {
                filterTag = tagMatch[1] as FilterTag;
                cellContent = removePrefixFromNode(cellContent, `~${filterTag}`);
              }
            }
            
            rowData[key] = cellContent;
          }
        });
        
        if (Object.keys(rowData).length > 0) {
          rows.push({ data: rowData, filterTag });
        }
      }
    });
  }
  
  // Filter rows based on tag visibility
  const filteredRows = filterableContext
    ? rows.filter(row => !row.filterTag || filterableContext.visibleTags.has(row.filterTag))
    : rows;
  
  // Extract just the data for the Table component
  const filteredData = filteredRows.map(row => row.data);

  // If no headers, the table is malformed
  if (headers.length === 0) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("MDXTable: No headers found. Check that the table has a valid <thead> structure.");
    }
    return <></>;
  }
  
  // If no data at all (before filtering), the table body is malformed
  if (rows.length === 0) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("MDXTable: No data rows found. Check that the table has a valid <tbody> structure.");
    }
    return <></>;
  }
  
  // If no data after filtering, this is expected behavior - return empty silently
  if (filteredData.length === 0) {
    return <></>;
  }

  // Create columns from headers
  const columns: Column<Record<string, ReactNode>>[] = headers.map(
    (header, index) => {
      // Get header text to match against config
      const headerText = extractTextFromNode(header.content).trim();
      const columnConfig = tableConfig?.columns?.[headerText];

      // Check if width should be auto (no fixed width)
      const isAutoWidth = columnConfig?.width === "auto";

      return {
        key: `col${index}`,
        header: columnConfig?.hideHeader ? "" : header.content,
        sticky: header.sticky,
        // Apply config or defaults for sticky columns
        ...(header.sticky && !isAutoWidth && {
          width: columnConfig?.width ?? "150px",
          minWidth: columnConfig?.minWidth ?? columnConfig?.width ?? "150px",
          ...(columnConfig?.maxWidth && { maxWidth: columnConfig.maxWidth }),
        }),
        // Auto width sticky: only apply minWidth if specified
        ...(header.sticky && isAutoWidth && {
          ...(columnConfig?.minWidth && { minWidth: columnConfig.minWidth }),
          ...(columnConfig?.maxWidth && { maxWidth: columnConfig.maxWidth }),
        }),
        // Apply config for non-sticky columns if provided
        ...(!header.sticky && columnConfig && {
          ...(columnConfig.width && columnConfig.width !== "auto" && { width: columnConfig.width }),
          ...(columnConfig.minWidth && { minWidth: columnConfig.minWidth }),
          ...(columnConfig.maxWidth && { maxWidth: columnConfig.maxWidth }),
        }),
      };
    }
  );

  // Create key extractor using row index for uniqueness
  const keyExtractor = (item: Record<string, ReactNode>, index: number): string => {
    const firstKey = columns[0]?.key;
    if (firstKey && item[firstKey]) {
      const value = item[firstKey];
      // Convert to string for key
      let keyPart = "";
      if (typeof value === "string") {
        keyPart = value;
      } else if (typeof value === "number") {
        keyPart = String(value);
      } else if (React.isValidElement(value)) {
        // Extract text from React element
        keyPart = extractTextFromNode(value) || "";
      }
      // Always include index to ensure uniqueness
      return `${keyPart}-${index}`;
    }
    return `row-${index}`;
  };

  return (
    <Table
      columns={columns}
      data={filteredData}
      keyExtractor={keyExtractor}
      highlightedHeader={highlightedHeader}
      stickyHeader={tableConfig?.stickyHeader}
      stickyHeaderOffset={tableConfig?.stickyHeaderOffset}
      noEllipsis={tableConfig?.noEllipsis}
    />
  );
}


