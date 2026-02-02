import { useState } from "preact/hooks";
import type { CategorySize, FileRow, Metric } from "../types";
import { FileRowComponent } from "./FileRow";
import { MetricValue } from "./MetricValue";

export function CategoryBlock({
  category,
  files,
  moduleName,
  visibleMetrics,
}: {
  category: CategorySize;
  files: FileRow[];
  moduleName: string;
  visibleMetrics: Record<Metric, boolean>;
}) {
  const [open, setOpen] = useState(false);
  const displayCategoryName =
    category.categoryName === "root" ? "." : category.categoryName;

  return (
    <details
      class="category"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary class="category-summary">
        <div class="label">{displayCategoryName}</div>
        <div class="stats">
          <MetricValue
            metric="raw"
            value={category.rawBytes}
            visible={visibleMetrics.raw}
          />
          <MetricValue
            metric="gzip"
            value={category.gzipBytes}
            visible={visibleMetrics.gzip}
          />
          <MetricValue
            metric="brotli"
            value={category.brotliBytes}
            visible={visibleMetrics.brotli}
          />
        </div>
      </summary>
      {open && (
        <div class="files">
          {files.map((file) => (
            <FileRowComponent
              key={file.fileName}
              file={file}
              moduleName={moduleName}
              categoryName={category.categoryName}
              visibleMetrics={visibleMetrics}
            />
          ))}
        </div>
      )}
    </details>
  );
}

