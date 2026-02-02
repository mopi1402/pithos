import { useState } from "preact/hooks";
import type { ModuleWithFiles, Metric } from "../types";
import { CategoryBlock } from "./CategoryBlock";
import { MetricValue } from "./MetricValue";

export function ModuleCard({
  module,
  visibleMetrics,
}: {
  module: ModuleWithFiles;
  visibleMetrics: Record<Metric, boolean>;
}) {
  const [open, setOpen] = useState(true);

  return (
    <details
      class="card"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary class="card-title">
        <div class="name badge">{module.moduleName}</div>
        <div class="stats">
          <MetricValue
            metric="raw"
            value={module.rawBytes}
            visible={visibleMetrics.raw}
          />
          <MetricValue
            metric="gzip"
            value={module.gzipBytes}
            visible={visibleMetrics.gzip}
          />
          <MetricValue
            metric="brotli"
            value={module.brotliBytes}
            visible={visibleMetrics.brotli}
          />
        </div>
      </summary>
      {open && (
        <div class="categories">
          {module.categories
            .slice()
            .sort((a, b) => {
              if (a.categoryName === "root") return 1;
              if (b.categoryName === "root") return -1;
              return a.categoryName.localeCompare(b.categoryName);
            })
            .map((cat) => {
            const files = module.files.filter(
              (file) => file.categoryName === cat.categoryName
            );
            return (
              <CategoryBlock
                key={cat.categoryName}
                category={cat}
                files={files}
                moduleName={module.moduleName}
                visibleMetrics={visibleMetrics}
              />
            );
          })}
        </div>
      )}
    </details>
  );
}

