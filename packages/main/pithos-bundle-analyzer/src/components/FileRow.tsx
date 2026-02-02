import type { FileRow as FileRowType, Metric } from "../types";
import { findModuleTransformByDisplayName } from "../utils";
import { MetricValue } from "./MetricValue";
import { Tooltip } from "./Tooltip";

export function FileRowComponent({
  file,
  moduleName,
  categoryName,
  visibleMetrics,
}: {
  file: FileRowType;
  moduleName: string;
  categoryName: string;
  visibleMetrics: Record<Metric, boolean>;
}) {
  let fileName = file.fileName;
  let tooltipText = file.fileName;
  const transform = findModuleTransformByDisplayName(moduleName);

  // Remove file path prefix if there's a transform
  if (
    transform?.filePathPrefix &&
    fileName.startsWith(transform.filePathPrefix)
  ) {
    fileName = fileName.slice(transform.filePathPrefix.length);
    tooltipText = fileName;
  }

  if (categoryName === "root") {
    if (fileName.startsWith("./")) {
      fileName = fileName.slice(2);
      tooltipText = fileName;
    }
    if (fileName.startsWith(`${moduleName}/`)) {
      fileName = fileName.slice(moduleName.length + 1);
      tooltipText = fileName;
    } else if (
      transform?.sourceModule &&
      fileName.startsWith(`${transform.sourceModule}/`)
    ) {
      fileName = fileName.slice(transform.sourceModule.length + 1);
      tooltipText = fileName;
    }
  }

  // Remove module/category prefix if present
  if (fileName.startsWith(`${moduleName}/${categoryName}/`)) {
    fileName = fileName.slice(`${moduleName}/${categoryName}/`.length);
  } else if (
    transform &&
    fileName.startsWith(`${transform.sourceModule}/${categoryName}/`)
  ) {
    // Fallback for source module paths
    fileName = fileName.slice(
      `${transform.sourceModule}/${categoryName}/`.length
    );
  } else if (transform?.filePathPrefix) {
    // Try with the full prefix + category
    const prefixWithCategory = `${transform.filePathPrefix}${categoryName}/`;
    if (file.fileName.startsWith(prefixWithCategory)) {
      fileName = file.fileName.slice(prefixWithCategory.length);
      tooltipText = fileName;
    }
  } else {
    // Generic fallback: remove first 2 parts
    const parts = fileName.split("/");
    fileName = parts.slice(2).join("/") || fileName;
  }

  return (
    <div class="file-row">
      <Tooltip text={tooltipText}>
        <div class="fname" dir="rtl">
          {fileName}
        </div>
      </Tooltip>
      <div class="stats">
        <MetricValue
          metric="raw"
          value={file.rawBytes}
          visible={visibleMetrics.raw}
        />
        <MetricValue
          metric="gzip"
          value={file.gzipBytes}
          visible={visibleMetrics.gzip}
        />
        <MetricValue
          metric="brotli"
          value={file.brotliBytes}
          visible={visibleMetrics.brotli}
        />
      </div>
    </div>
  );
}
