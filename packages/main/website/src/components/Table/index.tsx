import React from "react";
import styles from "./styles.module.css";
import { useScrollShadow } from "./useScrollShadow";
import { useStickyHeader } from "./useStickyHeader";

function parseMarkdownLinks(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string | ((item: T, index: number) => string);
  style?: (item: T, index: number) => React.CSSProperties;
  sticky?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  wrap?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  highlightedHeader?: boolean;
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  title,
  footer,
  highlightedHeader = false,
  stickyHeader = true,
  stickyHeaderOffset = 60,
}: TableProps<T>): React.ReactElement {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { isScrolledToEnd, shadowScale } = useScrollShadow(wrapperRef, {
    shadowWidth: 60,
  });

  const {
    tableRef,
    cloneTableRef,
    cloneWrapperRef,
  } = useStickyHeader({ topOffset: stickyHeaderOffset, wrapperRef });

  const stickyConfig = React.useMemo(() => {
    let currentOffset = "0px";
    return columns.map((col) => {
      if (!col.sticky) return null;
      const offset = currentOffset;
      if (col.width) {
        currentOffset = `calc(${currentOffset} + ${col.width})`;
      }
      return offset;
    });
  }, [columns]);

  const lastStickyIndex = columns.reduce((last, col, index) => {
    if (col.sticky) return index;
    return last;
  }, -1);

  const renderTableContent = (isClone = false) => (
    <>
      <thead>
        <tr>
          {columns.map((col, index) => {
            const isSticky = !!col.sticky;
            return (
              <th
                key={col.key}
                className={`${isSticky ? styles.stickyCell : ""} ${
                  isSticky && index === lastStickyIndex ? styles.stickySeparator : ""
                } ${col.wrap ? styles.wrap : ""}`}
                style={{
                  left: isSticky ? stickyConfig[index] || "0px" : undefined,
                  width: col.width,
                  minWidth: col.minWidth || col.width,
                  maxWidth: col.maxWidth,
                }}
              >
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>
      {!isClone && (
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={keyExtractor(item, rowIndex)}>
              {columns.map((col, colIndex) => {
                const cellClassName =
                  typeof col.className === "function"
                    ? col.className(item, rowIndex)
                    : col.className || "";
                const isSticky = !!col.sticky;
                const cellStyle = col.style ? col.style(item, rowIndex) : {};

                return (
                  <td
                    key={col.key}
                    className={`${cellClassName} ${isSticky ? styles.stickyCell : ""} ${
                      isSticky && colIndex === lastStickyIndex ? styles.stickySeparator : ""
                    } ${col.wrap ? styles.wrap : ""}`}
                    style={{
                      left: isSticky ? stickyConfig[colIndex] || "0px" : undefined,
                      width: col.width,
                      minWidth: col.minWidth || col.width,
                      maxWidth: col.maxWidth,
                      ...cellStyle,
                    }}
                  >
                    {col.render
                      ? col.render(item, rowIndex)
                      : (() => {
                          const value = (item as Record<string, React.ReactNode | string>)[col.key];
                          if (typeof value === "string") {
                            return parseMarkdownLinks(value);
                          }
                          return value;
                        })()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      )}
    </>
  );

  return (
    <div className={styles.tableContainer}>
      {title && <h3>{title}</h3>}
      <div
        ref={wrapperRef}
        className={`${styles.tableWrapper} ${isScrolledToEnd ? styles.scrolledToEnd : ""}`}
        style={{ ["--shadow-scale" as string]: shadowScale }}
      >
        <table
          ref={stickyHeader ? tableRef : undefined}
          className={`${styles.table} ${highlightedHeader ? styles.highlightedHeader : ""}`}
        >
          {renderTableContent(false)}
        </table>
      </div>
      
      {stickyHeader && (
        <div
          ref={cloneWrapperRef}
          className={`${styles.tableWrapper} ${styles.cloneWrapper}`}
          style={{ display: "none" }}
          aria-hidden="true"
        >
          <table
            ref={cloneTableRef}
            className={`${styles.table} ${styles.cloneTable} ${highlightedHeader ? styles.highlightedHeader : ""}`}
          />
        </div>
      )}
      
      {footer && <div className={styles.generatedAt}>{footer}</div>}
    </div>
  );
}
