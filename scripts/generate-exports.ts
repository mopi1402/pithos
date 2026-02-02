import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  scanDirectory,
  getSrcDir,
} from "./common/index.js";

interface ExportConfig {
  [key: string]: string;
}

interface KnipStaticConfig {
  ignoreBinaries?: string[];
  ignoreDependencies: string[];
  ignoreWorkspaces: string[];
  ignore: string[];
}

interface KnipConfig {
  $schema: string;
  workspaces: {
    [key: string]: {
      entry: string[];
      project: string[];
    };
  };
  ignoreBinaries?: string[];
  ignoreWorkspaces: string[];
  ignore: string[];
  ignoreDependencies: string[];
  ignoreExportsUsedInFile: boolean;
  rules: {
    duplicates: string;
  };
}

function loadKnipStaticConfig(): KnipStaticConfig {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const configPath = path.join(__dirname, "data", "knip-config.json");
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function generateExports(): ExportConfig {
  const srcDir = getSrcDir(import.meta.url);
  const exports: ExportConfig = {};

  // Find all TypeScript source files recursively
  const entries = scanDirectory(srcDir, {
    extensions: [".ts"],
    exclude: [".d.ts", ".test.", ".spec.", "node_modules", "_internal"],
    recursive: true,
    includeDirs: false
  });

  entries.forEach(entry => {
    // Calculate relative path from src (e.g., "arkhe/string/camel-case.ts")
    const relPath = entry.path.replace(srcDir + "/", "");

    // Create export path (e.g., "./arkhe/string/camel-case")
    // We want to expose the structure exactly as is
    const exportPath = "./" + relPath.replace(/\.ts$/, "");

    // Map to dist path (e.g., "./dist/arkhe/string/camel-case.js")
    const distPath = "./dist/" + relPath.replace(/\.ts$/, ".js");

    exports[exportPath] = distPath;
  });

  // Also support the wildcard format used in original script if preferred
  // The original script was doing directory-based wildcards:
  // "./arkhe/string/*": "./dist/arkhe/string/*.js"

  // Let's replicate the original behavior more exactly by scanning dirs
  const directories: Set<string> = new Set();

  // Find all directories that contain TS files
  const fileEntries = scanDirectory(srcDir, {
    extensions: [".ts"],
    exclude: [".d.ts", ".test.", ".spec.", "_internal"],
    recursive: true
  });

  fileEntries.forEach(file => {
    const dir = file.path.substring(0, file.path.lastIndexOf("/"));
    directories.add(dir);
  });

  // Clean exports object
  const wildcardExports: ExportConfig = {};

  directories.forEach(dir => {
    const relDir = dir.replace(srcDir, "");
    if (!relDir) return; // Skip root

    const cleanRelDir = relDir.startsWith("/") ? relDir.substring(1) : relDir;

    // Original format: "./path/to/dir/*": "./dist/path/to/dir/*.js"
    wildcardExports[`./${cleanRelDir}/*`] = `./dist/${cleanRelDir}/*.js`;
  });

  return wildcardExports;
}

function updatePackageJson(): void {
  // Use getPackageName to locate package.json safely if needed
  // but here we know relative path structure
  const srcDir = getSrcDir(import.meta.url);
  const packagePath = srcDir.replace("/src", "/package.json");

  const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const newExports = generateExports();

  packageContent.exports = newExports;

  delete packageContent.main;
  delete packageContent.module;
  delete packageContent.types;

  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));

  console.log("🔍 Exports:", newExports);
  console.log("📦 Generated exports:", Object.keys(newExports).length);
  console.log(
    `✅ '${packagePath}' updated with automatically generated exports!`
  );
}

function generateKnipConfig(): void {
  const srcDir = getSrcDir(import.meta.url);
  const rootDir = path.resolve(srcDir, "../../..");
  const knipPath = path.join(rootDir, "knip.json");

  // Load static config from data file
  const staticConfig = loadKnipStaticConfig();

  // Find all directories that contain TS files (same logic as generateExports)
  const fileEntries = scanDirectory(srcDir, {
    extensions: [".ts"],
    exclude: [".d.ts", ".test.", ".spec.", "_internal"],
    recursive: true
  });

  const directories: Set<string> = new Set();
  fileEntries.forEach(file => {
    const dir = file.path.substring(0, file.path.lastIndexOf("/"));
    directories.add(dir);
  });

  // Build entry patterns from directories
  const entryPatterns: string[] = [];
  directories.forEach(dir => {
    const relDir = dir.replace(srcDir, "");
    if (!relDir) return;
    const cleanRelDir = relDir.startsWith("/") ? relDir.substring(1) : relDir;
    entryPatterns.push(`src/${cleanRelDir}/*.ts`);
  });

  const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@5/schema.json",
    workspaces: {
      "packages/pithos": {
        entry: entryPatterns,
        project: ["src/**/*.ts", "!src/**/*.test.ts"]
      }
    },
    ...(staticConfig.ignoreBinaries && { ignoreBinaries: staticConfig.ignoreBinaries }),
    ignoreWorkspaces: staticConfig.ignoreWorkspaces,
    ignore: staticConfig.ignore,
    ignoreDependencies: staticConfig.ignoreDependencies,
    ignoreExportsUsedInFile: true,
    rules: {
      duplicates: "off"
    }
  };

  fs.writeFileSync(knipPath, JSON.stringify(knipConfig, null, 2) + "\n");

  console.log("🔧 Generated knip.json with", entryPatterns.length, "entry patterns");
}

updatePackageJson();
generateKnipConfig();
