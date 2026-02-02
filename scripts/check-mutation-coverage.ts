import { findTypeScriptFilesSync } from "./common/find-files";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "packages/pithos/src");
const REPORT_DIR = path.join(ROOT_DIR, "reports/mutation");
const REPORT_FILE = path.join(REPORT_DIR, "mutation_separate.html");
const CACHE_FILE = path.join(REPORT_DIR, ".mutation.cache");

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Parse args
const args = process.argv.slice(2);
const modulesArg = args.find((arg) => arg.startsWith("--modules="));
const allowedModules = modulesArg ? modulesArg.split("=")[1].split(",") : null;
const verbose = args.includes("--verbose");

// Cache types
interface CacheEntry {
  sourceHash: string;
  testHash: string;
  output: string;
}
type Cache = Record<string, CacheEntry>;

function loadCache(): Cache {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache: Cache): void {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  return createHash("sha256").update(content).digest("hex");
}

function cleanupOldTempDirs(): void {
  // Remove leftover .stryker-tmp-* directories
  const entries = fs.readdirSync(ROOT_DIR);
  for (const entry of entries) {
    if (entry.startsWith(".stryker-tmp")) {
      const fullPath = path.join(ROOT_DIR, entry);
      console.log(`🧹 Cleaning up ${entry}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

async function main() {
  console.log("🧹 Cleaning up old temp directories...");
  cleanupOldTempDirs();

  // Reset HTML report
  if (fs.existsSync(REPORT_FILE)) {
    fs.unlinkSync(REPORT_FILE);
  }

  console.log("🔍 Scanning files...");

  let allFiles = findTypeScriptFilesSync(SRC_DIR);

  // Filter by modules if requested
  if (allowedModules) {
    allFiles = allFiles.filter((file) => {
      const relative = path.relative(SRC_DIR, file);
      return allowedModules.some((mod) => relative.startsWith(mod));
    });
  }

  // Filter out excludes and pair with test files
  const tasks: { source: string; test: string }[] = [];

  for (const file of allFiles) {
    if (file.endsWith(".test.ts") || file.endsWith(".d.ts")) continue;
    const testFile = file.replace(/\.ts$/, ".test.ts");
    if (fs.existsSync(testFile)) {
      tasks.push({ source: file, test: testFile });
    }
  }

  console.log(`📋 Found ${tasks.length} files to mutate.`);

  const cache = loadCache();
  const results: { file: string; module: string; output: string }[] = [];

  let processed = 0;
  let cached = 0;

  // Progress tracking
  const startTime = Date.now();
  const processingTimes: number[] = [];

  function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  function logWithProgress(message: string): void {
    // Clear current line, print message, then reprint progress bar
    process.stdout.write(`\r\x1b[K${message}\n`);
    printProgressBar();
  }

  let currentProgress = { current: 0, total: 0 };

  function printProgressBar(): void {
    const { current, total } = currentProgress;
    if (total === 0) return;

    const percent = ((current / total) * 100).toFixed(1);
    const barWidth = 30;
    const filled = Math.round((current / total) * barWidth);
    const empty = barWidth - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);

    let eta = "calculating...";
    if (processingTimes.length > 0) {
      const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
      const remaining = total - current;
      const estimatedMs = avgTime * remaining;
      eta = formatTime(estimatedMs);
    }
    if (current === total) {
      eta = "done!";
    }

    process.stdout.write(`\r\x1b[K[${bar}] ${percent}% (${current}/${total}) | ETA: ${eta}`);
  }

  function updateProgress(current: number, total: number): void {
    currentProgress = { current, total };
    printProgressBar();
  }

  for (const task of tasks) {
    processed++;
    const relativeSource = path.relative(ROOT_DIR, task.source);
    const relativeTest = path.relative(ROOT_DIR, task.test);
    const cacheKey = relativeSource;

    const sourceHash = hashFile(task.source);
    const testHash = hashFile(task.test);

    const cachedEntry = cache[cacheKey];
    if (
      cachedEntry &&
      cachedEntry.sourceHash === sourceHash &&
      cachedEntry.testHash === testHash
    ) {
      // Use cached result
      cached++;
      updateProgress(processed, tasks.length);
      logWithProgress(`⚡ Cached ${relativeSource}`);
      const modulePath = path.dirname(path.relative(SRC_DIR, task.source));
      results.push({
        file: path.basename(task.source),
        module: modulePath,
        output: cachedEntry.output,
      });
      writeCustomHtmlReport(results);
      continue;
    }

    updateProgress(processed, tasks.length);
    logWithProgress(`🧪 Mutating ${relativeSource}...`);

    const taskStartTime = Date.now();

    try {
      const cmd = `pnpm stryker run --mutate "${relativeSource}" --testFiles "${relativeTest}" --reporters clear-text --logLevel error --tempDirName .stryker-tmp-${path.basename(
        task.source,
        ".ts"
      )}`;

      if (verbose) {
        console.log(`Executed command: ${cmd}`);
      }

      let stdout = "";
      try {
        stdout = execSync(cmd, {
          cwd: ROOT_DIR,
          encoding: "utf-8",
          stdio: "pipe",
        });
      } catch (e: any) {
        stdout = e.stdout ? e.stdout.toString() : "";
      }

      const cleanedOutput = cleanOutput(stdout);

      // Track processing time for ETA calculation
      const taskDuration = Date.now() - taskStartTime;
      processingTimes.push(taskDuration);
      // Keep only last 10 times for rolling average
      if (processingTimes.length > 10) {
        processingTimes.shift();
      }

      // Update cache
      cache[cacheKey] = { sourceHash, testHash, output: cleanedOutput };
      saveCache(cache);

      const modulePath = path.dirname(path.relative(SRC_DIR, task.source));
      results.push({
        file: path.basename(task.source),
        module: modulePath,
        output: cleanedOutput,
      });

      updateProgress(processed, tasks.length);
      writeCustomHtmlReport(results);
    } catch (err) {
      logWithProgress(`❌ Failed to run mutation on ${relativeSource}`);
      console.error(err);
    }
  }

  // Clear progress bar line before final message
  process.stdout.write("\r\x1b[K");

  const totalTime = Date.now() - startTime;
  console.log(
    `\n✅ Mutation testing complete! (${cached} cached, ${
      processed - cached
    } computed) in ${formatTime(totalTime)}`
  );
  console.log(`📄 Report available at: ${REPORT_FILE}`);
}

function cleanOutput(output: string): string {
  // Remove Stryker INFO logs (e.g., "20:19:49 (25794) INFO ...")
  return output
    .split("\n")
    .filter(
      (line) => !/^\d{2}:\d{2}:\d{2}\s+\(\d+\)\s+(INFO|WARN|ERROR)/.test(line)
    )
    .join("\n")
    .trim();
}

function colorizeOutput(text: string): string {
  // First escape HTML entities
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Remove any ANSI codes that might be present
  html = html.replace(/\x1b\[\d+m/g, "");

  // Apply semantic coloring line by line
  const lines = html.split("\n");
  const coloredLines = lines.map((line) => {
    // [Survived] blocks - red (bad)
    if (line.includes("[Survived]")) {
      return `<span class="c-red">${line}</span>`;
    }
    // Killed tests - green (good)
    if (line.match(/^\s*✓.*\(killed/)) {
      return `<span class="c-green">${line}</span>`;
    }
    // Covered tests - yellow/dim
    if (line.match(/^\s*~.*\(covered/)) {
      return `<span class="c-dim">${line}</span>`;
    }
    // No coverage - red
    if (line.match(/^\s*✗|no coverage/i)) {
      return `<span class="c-red">${line}</span>`;
    }
    // Diff: removed lines
    if (line.match(/^-\s+/) && !line.startsWith("---")) {
      return `<span class="c-red">${line}</span>`;
    }
    // Diff: added lines
    if (line.match(/^\+\s+/) && !line.startsWith("+++")) {
      return `<span class="c-green">${line}</span>`;
    }
    // Score table - highlight 100%
    if (line.includes("100.00")) {
      return `<span class="c-green">${line}</span>`;
    }
    // Score table - highlight low scores
    if (line.match(/\|\s+(\d+\.\d+)\s+\|/) && !line.includes("100.00")) {
      const match = line.match(/\|\s+(\d+\.\d+)\s+\|/);
      if (match) {
        const score = parseFloat(match[1]);
        if (score < 50) return `<span class="c-red">${line}</span>`;
        if (score < 80) return `<span class="c-yellow">${line}</span>`;
      }
    }
    // "All tests/" header
    if (line.startsWith("All tests/")) {
      return `<span class="c-cyan c-bold">${line}</span>`;
    }
    return line;
  });

  return coloredLines.join("\n");
}

function extractScore(output: string): number | null {
  // Look for the "All files" row in the table and extract the total score
  // Format: "All files      | 100.00 |  100.00 |"
  const match = output.match(/All files\s*\|\s*(\d+\.?\d*)\s*\|/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

function getScoreClass(score: number): string {
  if (score === 100) return "score-perfect";
  if (score >= 80) return "score-high";
  if (score >= 50) return "score-medium";
  return "score-low";
}

function writeCustomHtmlReport(
  results: { file: string; module: string; output: string }[]
) {
  // Group by module
  const grouped = new Map<string, typeof results>();
  for (const r of results) {
    if (!grouped.has(r.module)) grouped.set(r.module, []);
    grouped.get(r.module)!.push(r);
  }

  // Sort modules alphabetically
  const sortedModules = [...grouped.keys()].sort();

  let modulesContent = "";
  for (const mod of sortedModules) {
    const items = grouped.get(mod)!;

    // Calculate average score for this module
    const scores = items
      .map((r) => extractScore(r.output))
      .filter((s): s is number => s !== null);
    const avgScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;
    const scoreDisplay =
      avgScore !== null
        ? `<span class="module-score ${getScoreClass(
            avgScore
          )}">${avgScore.toFixed(1)}%${avgScore === 100 ? " 🌟" : ""}</span>`
        : "";

    let filesContent = "";
    for (const r of items) {
      const fileScore = extractScore(r.output);
      const scoreClass = fileScore !== null ? getScoreClass(fileScore) : "score-unknown";
      const fileScoreDisplay =
        fileScore !== null
          ? `<span class="file-score ${scoreClass}">${fileScore.toFixed(0)}%${
              fileScore === 100 ? " 🌟" : ""
            }</span>`
          : "";
      filesContent += `
      <div class="file-entry" data-score-class="${scoreClass}">
        <div class="file-name">${r.file} ${fileScoreDisplay}</div>
        <pre class="file-output">${colorizeOutput(r.output)}</pre>
      </div>`;
    }
    modulesContent += `
    <details class="module-details" data-module="${mod}">
      <summary class="module-header">📁 ${mod} <span class="count">(${items.length} files)</span> ${scoreDisplay}</summary>
      ${filesContent}
    </details>`;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mutation Coverage Report</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&display=swap");
    
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      padding: 20px; 
      background: #0a0a0a; 
      color: #e8e4e0; 
    }
    h1 { 
      color: #c9a962; 
      font-family: "Cormorant Garamond", serif;
      font-weight: 700;
      text-transform: uppercase;
    }
    details { margin-bottom: 8px; background: #111111; border: 1px solid #1a1a1a; border-radius: 6px; }
    details.hidden { display: none; }
    summary.module-header { 
      padding: 12px 16px; 
      background: #151515; 
      cursor: pointer; 
      font-weight: bold;
      border-radius: 6px;
      user-select: none;
      color: #f26f17;
    }
    summary.module-header:hover { background: #1a1a1a; }
    details[open] summary.module-header { border-radius: 6px 6px 0 0; }
    .count { color: #b0b3b8; font-weight: normal; font-size: 0.9em; }
    .file-entry { border-top: 1px solid #1a1a1a; padding: 12px 16px; }
    .file-entry.hidden { display: none; }
    .file-name { font-weight: bold; color: #f26f17; margin-bottom: 8px; }
    .file-output { margin: 0; white-space: pre-wrap; font-family: 'Fira Code', 'JetBrains Mono', monospace; font-size: 13px; background: #1a1614; padding: 12px; border-radius: 4px; color: #e8e4e0; }
    .controls { margin-bottom: 16px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .controls button { padding: 8px 16px; cursor: pointer; border: 1px solid #1a1a1a; border-radius: 4px; background: #111111; color: #e8e4e0; }
    .controls button:hover { background: #1a1a1a; border-color: #f26f17; }
    
    /* Filter checkboxes */
    .filters { display: flex; gap: 12px; align-items: center; }
    .filters label { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 12px; border-radius: 4px; border: 1px solid #1a1a1a; background: #111111; }
    .filters label:hover { background: #1a1a1a; }
    .filters input[type="checkbox"] { cursor: pointer; }
    .filter-low { color: #f14c4c; }
    .filter-medium { color: #e6b450; }
    .filter-high { color: #b5d676; }
    .filter-perfect { color: #7ec699; }
    
    /* Semantic Colors */
    .c-red { color: #f14c4c; }
    .c-green { color: #7ec699; }
    .c-yellow { color: #e6b450; }
    .c-cyan { color: #c9a962; }
    .c-dim { color: #6d6560; }
    .c-bold { font-weight: bold; }
    
    /* Score Colors */
    .module-score, .file-score { 
      padding: 2px 8px; 
      border-radius: 4px; 
      font-size: 0.85em;
      margin-left: 8px;
    }
    .score-high { background: rgba(181, 214, 118, 0.2); color: #b5d676; }
    .score-medium { background: rgba(230, 180, 80, 0.2); color: #e6b450; }
    .score-low { background: rgba(241, 76, 76, 0.2); color: #f14c4c; }
    .score-perfect { background: rgba(126, 198, 153, 0.2); color: #7ec699; font-weight: bold; border: 1px solid rgba(126, 198, 153, 0.3); }
    .file-score { font-size: 0.8em; }
  </style>
</head>
<body>
  <h1>👾 Mutation Coverage Report</h1>
  <div class="controls">
    <button onclick="document.querySelectorAll('details').forEach(d => d.open = true)">Expand All</button>
    <button onclick="document.querySelectorAll('details').forEach(d => d.open = false)">Collapse All</button>
    <div class="filters">
      <span>Filter:</span>
      <label class="filter-low"><input type="checkbox" id="filter-low" checked onchange="applyFilters()"> Low (&lt;50%)</label>
      <label class="filter-medium"><input type="checkbox" id="filter-medium" checked onchange="applyFilters()"> Medium (50-79%)</label>
      <label class="filter-high"><input type="checkbox" id="filter-high" checked onchange="applyFilters()"> High (80-99%)</label>
      <label class="filter-perfect"><input type="checkbox" id="filter-perfect" checked onchange="applyFilters()"> Perfect (100%)</label>
    </div>
  </div>
  ${modulesContent}
  <script>
    function applyFilters() {
      const showLow = document.getElementById('filter-low').checked;
      const showMedium = document.getElementById('filter-medium').checked;
      const showHigh = document.getElementById('filter-high').checked;
      const showPerfect = document.getElementById('filter-perfect').checked;
      
      const modules = document.querySelectorAll('.module-details');
      
      modules.forEach(module => {
        const files = module.querySelectorAll('.file-entry');
        let visibleCount = 0;
        
        files.forEach(file => {
          const scoreClass = file.dataset.scoreClass;
          let show = false;
          
          if (scoreClass === 'score-low' && showLow) show = true;
          if (scoreClass === 'score-medium' && showMedium) show = true;
          if (scoreClass === 'score-high' && showHigh) show = true;
          if (scoreClass === 'score-perfect' && showPerfect) show = true;
          
          file.classList.toggle('hidden', !show);
          if (show) visibleCount++;
        });
        
        // Hide module if no visible files
        module.classList.toggle('hidden', visibleCount === 0);
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(REPORT_FILE, htmlContent);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
