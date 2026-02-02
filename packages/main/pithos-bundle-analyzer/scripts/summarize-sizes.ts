import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";
import type {
  ModuleSize,
  FileRow,
  CategorySize,
  ModuleWithFiles,
} from "../src/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pithosSrcDir = path.resolve(__dirname, "../../../pithos/dist");
const outputPath = path.resolve(__dirname, "../dist/size-table.tsv");
const outputJsonPath = path.resolve(__dirname, "../dist/size-table.json");

// Import module helpers using dynamic import to avoid ESM resolution issues
const utilsPath = path.resolve(__dirname, "../src/utils.ts");
const utilsUrl = `file://${utilsPath}`;
const utilsModule = await import(utilsUrl);
const { findModuleTransform, getModuleDisplayName } = utilsModule;


const moduleNames = [
  "arkhe",
  "kanon",
  "taphos",
  "zygos",
  "sphalma",
];

/**
 * Derives module and category from a path relative to dist/src.
 */
function detectModuleAndCategory(relativePath: string): {
  moduleName: string;
  categoryName: string;
} {
  const parts = relativePath.split("/").filter(Boolean);
  const sourceModuleName = parts[0] ?? "misc";
  const transform = findModuleTransform(sourceModuleName);

  // If there's a transform with skipLevels, apply it
  if (transform?.skipLevels) {
    let partIndex = 1;
    // Skip the specified levels
    for (const skipLevel of transform.skipLevels) {
      if (parts[partIndex] === skipLevel) {
        partIndex++;
      }
    }
    const rawCategory = parts[partIndex];
    const categoryName =
      rawCategory && !rawCategory.includes(".") ? rawCategory : "root";
    return { moduleName: transform.displayName, categoryName };
  }

  const rawCategory = parts[1];
  const categoryName =
    rawCategory && !rawCategory.includes(".") ? rawCategory : "root";
  if (!moduleNames.includes(sourceModuleName)) {
    return { moduleName: "misc", categoryName: "root" };
  }
  const displayName = getModuleDisplayName(sourceModuleName);
  return { moduleName: displayName, categoryName };
}

/**
 * Computes raw, gzip, and brotli sizes for a file.
 */
function computeSizes(
  fileContent: Buffer,
  moduleName: string,
  categoryName: string,
  fileName: string
): FileRow {
  const rawBytes = fileContent.byteLength;
  // Use maximum compression for CDN deployment
  const gzipBytes = gzipSync(fileContent as any, { level: 9 }).byteLength;
  const brotliBytes = brotliCompressSync(fileContent as any, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_LGWIN]: 22,
    },
  }).byteLength;
  return {
    moduleName,
    categoryName,
    fileName,
    rawBytes,
    gzipBytes,
    brotliBytes,
  };
}

/**
 * Aggregates size rows by module.
 */
function aggregateByModule(rows: FileRow[]): ModuleSize[] {
  const totals = new Map<string, ModuleSize>();
  for (const row of rows) {
    const existing = totals.get(row.moduleName);
    const next: ModuleSize = existing
      ? {
        moduleName: row.moduleName,
        rawBytes: existing.rawBytes + row.rawBytes,
        gzipBytes: existing.gzipBytes + row.gzipBytes,
        brotliBytes: existing.brotliBytes + row.brotliBytes,
      }
      : {
        moduleName: row.moduleName,
        rawBytes: row.rawBytes,
        gzipBytes: row.gzipBytes,
        brotliBytes: row.brotliBytes,
      };
    totals.set(row.moduleName, next);
  }
  return Array.from(totals.values()).sort((a, b) => b.rawBytes - a.rawBytes);
}

/**
 * Aggregates size rows by category inside a module.
 */
function aggregateCategories(
  rows: FileRow[],
  moduleName: string
): CategorySize[] {
  const totals = new Map<string, CategorySize>();
  for (const row of rows.filter((r) => r.moduleName === moduleName)) {
    const existing = totals.get(row.categoryName);
    const next: CategorySize = existing
      ? {
        categoryName: row.categoryName,
        rawBytes: existing.rawBytes + row.rawBytes,
        gzipBytes: existing.gzipBytes + row.gzipBytes,
        brotliBytes: existing.brotliBytes + row.brotliBytes,
      }
      : {
        categoryName: row.categoryName,
        rawBytes: row.rawBytes,
        gzipBytes: row.gzipBytes,
        brotliBytes: row.brotliBytes,
      };
    totals.set(row.categoryName, next);
  }
  return Array.from(totals.values()).sort((a, b) => b.rawBytes - a.rawBytes);
}

/**
 * Formats bytes into a human readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} kB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Formats rows and module totals as a TSV string.
 */
function toTsv(rows: FileRow[], moduleTotals: ModuleSize[]): string {
  const detailHeader =
    "module\tcategory\tfile\trawBytes\tgzipBytes\tbrotliBytes";
  const detailLines = rows
    .sort((a, b) => b.rawBytes - a.rawBytes)
    .map(
      (row) =>
        `${row.moduleName}\t${row.categoryName}\t${row.fileName}\t${row.rawBytes}\t${row.gzipBytes}\t${row.brotliBytes}`
    );
  const totalsHeader = "module\tTOTAL\trawBytes\tgzipBytes\tbrotliBytes";
  const totalsLines = moduleTotals.map(
    (row) =>
      `${row.moduleName}\tTOTAL\t${row.rawBytes}\t${row.gzipBytes}\t${row.brotliBytes}`
  );
  const grandTotal = moduleTotals.reduce<ModuleSize>(
    (acc, row) => ({
      moduleName: "grand-total",
      rawBytes: acc.rawBytes + row.rawBytes,
      gzipBytes: acc.gzipBytes + row.gzipBytes,
      brotliBytes: acc.brotliBytes + row.brotliBytes,
    }),
    { moduleName: "grand-total", rawBytes: 0, gzipBytes: 0, brotliBytes: 0 }
  );
  const grandLine = `${grandTotal.moduleName}\tTOTAL\t${grandTotal.rawBytes}\t${grandTotal.gzipBytes}\t${grandTotal.brotliBytes}`;
  return [
    detailHeader,
    ...detailLines,
    "",
    totalsHeader,
    ...totalsLines,
    grandLine,
  ].join("\n");
}

/**
 * Builds a JSON summary grouped by module with per-file details.
 */
function toJson(
  rows: FileRow[],
  moduleTotals: ModuleSize[]
): { modules: ModuleWithFiles[]; grandTotal: ModuleSize } {
  const grouped = new Map<string, FileRow[]>();
  for (const row of rows) {
    const existing = grouped.get(row.moduleName) ?? [];
    existing.push(row);
    grouped.set(row.moduleName, existing);
  }

  const modules: ModuleWithFiles[] = moduleTotals.map((module) => {
    const files = (grouped.get(module.moduleName) ?? [])
      .slice()
      .sort((a, b) => a.fileName.localeCompare(b.fileName));
    const categories = aggregateCategories(files, module.moduleName).sort(
      (a, b) => a.categoryName.localeCompare(b.categoryName)
    );
    return { ...module, categories, files };
  });

  const grandTotal = moduleTotals.reduce<ModuleSize>(
    (acc, row) => ({
      moduleName: "grand-total",
      rawBytes: acc.rawBytes + row.rawBytes,
      gzipBytes: acc.gzipBytes + row.gzipBytes,
      brotliBytes: acc.brotliBytes + row.brotliBytes,
    }),
    { moduleName: "grand-total", rawBytes: 0, gzipBytes: 0, brotliBytes: 0 }
  );

  return { modules, grandTotal };
}

/**
 * Generates a TSV table with per-file and per-module bundle sizes.
 */
async function generateSizeTable(): Promise<void> {
  const jsFiles: string[] = [];
  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const normalizedPath = full.replace(/\\/g, "/");
      if (entry.isDirectory()) {
        if (
          full.includes(`${path.sep}benchmark${path.sep}`) ||
          full.includes(`${path.sep}tmp${path.sep}`) ||
          full.includes(`${path.sep}test${path.sep}`) ||
          full.includes(`${path.sep}tests${path.sep}`) ||
          full.includes(`${path.sep}__tests__${path.sep}`) ||
          normalizedPath.includes("/kanon/v1") ||
          normalizedPath.includes("/kanon/v2")
        ) {
          continue;
        }
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        if (
          entry.name.includes(".test.") ||
          entry.name.includes(".spec.") ||
          full.includes(`${path.sep}test${path.sep}`) ||
          full.includes(`${path.sep}tests${path.sep}`) ||
          full.includes(`${path.sep}__tests__${path.sep}`) ||
          normalizedPath.includes("/kanon/v1/") ||
          normalizedPath.includes("/kanon/v2/")
        ) {
          continue;
        }
        jsFiles.push(full);
      }
    }
  };


  if (!existsSync(pithosSrcDir)) {
    console.warn(
      `Warning: Directory ${pithosSrcDir} does not exist. Generating empty size table.`
    );
    // Write empty/default files so downstream tools don't fail
    await fs.writeFile(outputPath, "", "utf8");
    await fs.writeFile(
      outputJsonPath,
      JSON.stringify({ modules: [], grandTotal: { moduleName: "grand-total", rawBytes: 0, gzipBytes: 0, brotliBytes: 0 } }, null, 2),
      "utf8"
    );
    return;
  }

  await walk(pithosSrcDir);
  const rows: FileRow[] = [];
  for (const fileName of jsFiles) {
    const content = await fs.readFile(fileName);
    const relative = path
      .relative(pithosSrcDir, fileName)
      .split(path.sep)
      .join("/");
    const { moduleName, categoryName } = detectModuleAndCategory(relative);
    rows.push(computeSizes(content, moduleName, categoryName, relative));
  }
  const totals = aggregateByModule(rows);
  const tsv = toTsv(rows, totals);
  const json = toJson(rows, totals);
  await fs.writeFile(outputPath, tsv, "utf8");
  await fs.writeFile(
    outputJsonPath,
    `${JSON.stringify(json, null, 2)}\n`,
    "utf8"
  );

  // Remove size-report.html if it exists (not needed, we use index.html)
  const sizeReportPath = path.resolve(__dirname, "../dist/size-report.html");
  try {
    await fs.unlink(sizeReportPath);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

generateSizeTable().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
