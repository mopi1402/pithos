import { useMemo, useState } from "preact/hooks";
import type { Metric, ModuleWithFiles } from "../types";
import { useSizeData, useColumnCount } from "../hooks";
import { getModuleColumns, findModuleTransformByDisplayName } from "../utils";
import { Header } from "./Header";
import { ModuleCard } from "./ModuleCard";

export function App() {
  const { data, error, loading } = useSizeData();
  const columnCount = useColumnCount();
  const [visibleMetrics, setVisibleMetrics] = useState<Record<Metric, boolean>>(
    {
      raw: true,
      gzip: true,
      brotli: true,
    }
  );

  const totals = useMemo(
    () =>
      data
        ? {
            raw: data.grandTotal.rawBytes,
            gzip: data.grandTotal.gzipBytes,
            brotli: data.grandTotal.brotliBytes,
          }
        : null,
    [data]
  );

  const columns = useMemo(() => {
    if (!data) return [];
    const moduleColumns = getModuleColumns(columnCount);
    const moduleMap = new Map<string, ModuleWithFiles>();
    data.modules.forEach((module) => {
      // Map both the actual name and the lowercase version
      moduleMap.set(module.moduleName, module);
      moduleMap.set(module.moduleName.toLowerCase(), module);
      // Map source module name if there's a transform
      const transform = findModuleTransformByDisplayName(module.moduleName);
      if (transform) {
        moduleMap.set(transform.sourceModule, module);
        moduleMap.set(transform.sourceModule.toLowerCase(), module);
      }
    });

    return moduleColumns.map((columnModules) => {
      const modules: ModuleWithFiles[] = [];
      for (const moduleName of columnModules) {
        // Try exact match first, then lowercase
        const module =
          moduleMap.get(moduleName) || moduleMap.get(moduleName.toLowerCase());
        if (module) {
          modules.push(module);
        }
      }
      return modules;
    });
  }, [data, columnCount]);

  const toggleMetric = (metric: Metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  return (
    <>
      <Header
        visibleMetrics={visibleMetrics}
        totals={totals}
        toggleMetric={toggleMetric}
      />

      {loading && <div class="loading">Loading sizes…</div>}
      {error && (
        <div class="error">Failed to load size-table.json: {error}</div>
      )}

      {!loading && !error && (
        <main class="masonry">
          {columns.map((columnModules, colIndex) => (
            <div key={colIndex} class="masonry-column">
              {columnModules.map((module) => (
                <ModuleCard
                  key={module.moduleName}
                  module={module}
                  visibleMetrics={visibleMetrics}
                />
              ))}
            </div>
          ))}
        </main>
      )}
    </>
  );
}
