#!/usr/bin/env node
import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
};

interface BenchResult {
  name: string;
  hz: number;
  suite?: string;
  min?: number;
  max?: number;
  mean?: number;
  p75?: number;
  p99?: number;
  p995?: number;
  p999?: number;
  rme?: string;
  samples?: number;
}

interface ScenarioResult {
  library: string;
  opsPerSecond: number;
  rank: number;
  ratio: number;
  isFastest: boolean;
  stats: {
    min: number;
    max: number;
    mean: number;
    p75: number;
    p99: number;
    p995: number;
    p999: number;
    rme: string;
    samples: number;
  };
}

interface ScenarioData {
  name: string;
  results: ScenarioResult[];
}

interface LibrarySummary {
  library: string;
  wins: number;
  totalTests: number;
}

interface BenchmarkReport {
  generatedAt: string;
  versions: Record<string, string>;
  libraries: string[];
  scenarios: ScenarioData[];
  summary: {
    totalScenarios: number;
    libraryRankings: LibrarySummary[];
    winner: string;
  };
}

// Remove ANSI color codes from string
function stripAnsiCodes(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

// Format scenario name: extract utility name and detail
// Input formats: "utilityName", "utilityName/detail", "utilityName - detail", "utilityName detail"
// Output: { name: "utilityName", detail: "detail" | null, displayName: "utilityName\ndetail" }
function parseScenarioName(name: string): { utilityName: string; detail: string | null; displayName: string } {
  // Pattern 1: "utilityName/detail" (slash separator - preferred format)
  const slashMatch = name.match(/^(\w+)\/(.+)$/);
  if (slashMatch) {
    return {
      utilityName: slashMatch[1],
      detail: slashMatch[2],
      displayName: `${slashMatch[1]}\n${slashMatch[2]}`,
    };
  }
  
  // Pattern 2: "utilityName - detail" (dash separator)
  const dashMatch = name.match(/^(\w+)\s+-\s+(.+)$/);
  if (dashMatch) {
    return {
      utilityName: dashMatch[1],
      detail: dashMatch[2],
      displayName: `${dashMatch[1]}\n${dashMatch[2]}`,
    };
  }
  
  // Pattern 3: "utilityName (detail)" (parentheses)
  const parenMatch = name.match(/^(\w+)\s+\((.+)\)$/);
  if (parenMatch) {
    return {
      utilityName: parenMatch[1],
      detail: parenMatch[2],
      displayName: `${parenMatch[1]}\n${parenMatch[2]}`,
    };
  }
  
  // Pattern 4: "utilityName detail" (space separated, first word is utility)
  // Only if there's more than one word and first word looks like a function name
  const spaceMatch = name.match(/^(\w+)\s+(.+)$/);
  if (spaceMatch && /^[a-z]/.test(spaceMatch[1])) {
    return {
      utilityName: spaceMatch[1],
      detail: spaceMatch[2],
      displayName: `${spaceMatch[1]}\n${spaceMatch[2]}`,
    };
  }
  
  // No detail, just the utility name
  return {
    utilityName: name,
    detail: null,
    displayName: name,
  };
}

// Extract library name from test name
function extractLibraryName(testName: string): string {
  if (testName.includes("arkhe/")) return "arkhe";
  if (testName.includes("es-toolkit/compat/")) return "es-toolkit/compat";
  if (testName.includes("es-toolkit (compat)/")) return "es-toolkit/compat";
  if (testName.includes("es-toolkit/")) return "es-toolkit";
  if (testName.includes("lodash-es/")) return "lodash-es";
  if (testName.includes("lodash/")) return "lodash";
  return testName;
}

// Parse Vitest benchmark output
function parseVitestOutput(output: string): BenchResult[] {
  const results: BenchResult[] = [];
  const cleanOutput = stripAnsiCodes(output);
  const lines = cleanOutput.split("\n");

  let currentSuite = "";
  let currentFile = "";

  for (const line of lines) {
    // Detect file being tested (e.g., "✓ packages/arkhe/benchmarks/difference.bench.ts > difference 9387ms")
    const fileMatch = line.match(/[✓✗]\s+packages\/arkhe\/benchmarks\/(\w+)\.bench\.ts\s+>\s+(.+?)\s+\d+ms/);
    if (fileMatch) {
      currentFile = fileMatch[1]; // e.g., "difference"
      currentSuite = fileMatch[2]; // e.g., "difference" or "difference/largeArray"
      continue;
    }

    // Alternative suite detection from BENCH Summary section
    const summaryMatch = line.match(/^\s+(.+?)\s+-\s+packages\/arkhe\/benchmarks\/(\w+)\.bench\.ts\s+>\s+(.+)$/);
    if (summaryMatch) {
      // This is in the summary section, skip
      continue;
    }

    // Parse benchmark result lines with full stats
    // Format: "   · arkhe/difference    9,199,127.47  0.0000  3.6820  0.0001  0.0001  0.0001  0.0002  0.0032  ±1.62%  4599564"
    const fullMatch = line.match(
      /^\s*·\s+(.+?)\s+([\d,]+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(±[\d.]+%)\s+(\d+)/
    );
    if (fullMatch) {
      const [, name, hz, min, max, mean, p75, p99, p995, p999, rme, samples] = fullMatch;
      results.push({
        name: name.trim(),
        hz: parseFloat(hz.replace(/,/g, "")),
        suite: currentSuite || currentFile || "Unknown",
        min: parseFloat(min),
        max: parseFloat(max),
        mean: parseFloat(mean),
        p75: parseFloat(p75),
        p99: parseFloat(p99),
        p995: parseFloat(p995),
        p999: parseFloat(p999),
        rme,
        samples: parseInt(samples, 10),
      });
      continue;
    }

    // Fallback: simple match without detailed stats
    const simpleMatch = line.match(/^\s*·\s+(.+?)\s+([\d,]+(?:\.\d+)?)\s+/);
    if (simpleMatch) {
      results.push({
        name: simpleMatch[1].trim(),
        hz: parseFloat(simpleMatch[2].replace(/,/g, "")),
        suite: currentSuite || currentFile || "Unknown",
      });
    }
  }

  return results;
}

// Get package versions from node_modules
async function getPackageVersions(): Promise<Record<string, string>> {
  const packages: Record<string, string> = {
    "es-toolkit": "es-toolkit",
    "lodash": "lodash",
    "lodash-es": "lodash-es",
  };

  const versions: Record<string, string> = {};

  // Add arkhe version from pithos package
  try {
    const pithosPath = path.resolve(process.cwd(), "packages/pithos/package.json");
    const pithosContent = await fs.readFile(pithosPath, "utf-8");
    const pithosJson = JSON.parse(pithosContent);
    versions["arkhe"] = pithosJson.version || "unknown";
  } catch {
    versions["arkhe"] = "unknown";
  }

  // Get versions from node_modules
  for (const [key, pkgName] of Object.entries(packages)) {
    try {
      const pkgPath = path.resolve(process.cwd(), `node_modules/${pkgName}/package.json`);
      const content = await fs.readFile(pkgPath, "utf-8");
      const json = JSON.parse(content);
      versions[key] = json.version || "unknown";
    } catch {
      versions[key] = "unknown";
    }
  }

  return versions;
}

// Generate JSON report for website
async function generateReport(results: BenchResult[]): Promise<BenchmarkReport> {
  const versions = await getPackageVersions();

  // Group results by suite
  const grouped: Map<string, BenchResult[]> = new Map();

  results.forEach((result) => {
    const suite = result.suite || "Unknown";
    if (!grouped.has(suite)) {
      grouped.set(suite, []);
    }
    grouped.get(suite)!.push(result);
  });

  const libraries = Array.from(
    new Set(results.map(r => extractLibraryName(r.name)))
  ).sort();

  // Build scenarios data
  const scenarios: ScenarioData[] = [];
  const winsCount: Map<string, number> = new Map();

  libraries.forEach(lib => winsCount.set(lib, 0));

  grouped.forEach((suiteResults, suiteName) => {
    const maxOps = Math.max(...suiteResults.map(r => r.hz));
    const sorted = [...suiteResults].sort((a, b) => b.hz - a.hz);
    const parsed = parseScenarioName(suiteName);

    const scenarioResults: ScenarioResult[] = sorted.map((result, index) => ({
      library: extractLibraryName(result.name),
      opsPerSecond: parseFloat(result.hz.toFixed(2)),
      rank: index + 1,
      ratio: maxOps > 0 ? parseFloat((maxOps / result.hz).toFixed(2)) : 0,
      isFastest: index === 0,
      stats: {
        min: result.min ?? 0,
        max: result.max ?? 0,
        mean: result.mean ?? 0,
        p75: result.p75 ?? 0,
        p99: result.p99 ?? 0,
        p995: result.p995 ?? 0,
        p999: result.p999 ?? 0,
        rme: result.rme ?? "N/A",
        samples: result.samples ?? 0,
      },
    }));

    scenarios.push({
      name: parsed.displayName,
      results: scenarioResults,
    });

    // Track wins
    if (sorted.length > 0) {
      const winner = extractLibraryName(sorted[0].name);
      winsCount.set(winner, (winsCount.get(winner) || 0) + 1);
    }
  });

  // Sort scenarios alphabetically by utility name
  scenarios.sort((a, b) => {
    const nameA = a.name.split('\n')[0].toLowerCase();
    const nameB = b.name.split('\n')[0].toLowerCase();
    if (nameA !== nameB) return nameA.localeCompare(nameB);
    // If same utility name, sort by detail
    const detailA = a.name.split('\n')[1] || '';
    const detailB = b.name.split('\n')[1] || '';
    return detailA.localeCompare(detailB);
  });

  // Build library rankings
  const libraryRankings: LibrarySummary[] = libraries
    .map(lib => ({
      library: lib,
      wins: winsCount.get(lib) || 0,
      totalTests: scenarios.length,
    }))
    .sort((a, b) => b.wins - a.wins);

  return {
    generatedAt: new Date().toISOString(),
    versions,
    libraries,
    scenarios,
    summary: {
      totalScenarios: scenarios.length,
      libraryRankings,
      winner: libraryRankings[0]?.library || "",
    },
  };
}

// Merge new benchmark results into an existing report (update only affected scenarios)
async function mergeIntoExistingReport(newResults: BenchResult[], reportPath: string): Promise<BenchmarkReport> {
  // Load existing report
  const existingContent = await fs.readFile(reportPath, "utf-8");
  const existing: BenchmarkReport = JSON.parse(existingContent);

  // Generate a partial report from the new results
  const partial = await generateReport(newResults);

  // Determine which utility names were re-benchmarked
  const newScenarioNames = new Set(partial.scenarios.map(s => s.name));

  // Replace matching scenarios, keep the rest
  const mergedScenarios = existing.scenarios
    .filter(s => !newScenarioNames.has(s.name))
    .concat(partial.scenarios);

  // Re-sort alphabetically
  mergedScenarios.sort((a, b) => {
    const nameA = a.name.split('\n')[0].toLowerCase();
    const nameB = b.name.split('\n')[0].toLowerCase();
    if (nameA !== nameB) return nameA.localeCompare(nameB);
    const detailA = a.name.split('\n')[1] || '';
    const detailB = b.name.split('\n')[1] || '';
    return detailA.localeCompare(detailB);
  });

  // Recompute wins from merged scenarios
  const winsCount: Map<string, number> = new Map();
  for (const s of mergedScenarios) {
    const fastest = s.results.find(r => r.isFastest);
    if (fastest) {
      winsCount.set(fastest.library, (winsCount.get(fastest.library) || 0) + 1);
    }
  }

  const libraries = Array.from(new Set(mergedScenarios.flatMap(s => s.results.map(r => r.library)))).sort();
  const libraryRankings: LibrarySummary[] = libraries
    .map(lib => ({
      library: lib,
      wins: winsCount.get(lib) || 0,
      totalTests: mergedScenarios.length,
    }))
    .sort((a, b) => b.wins - a.wins);

  return {
    generatedAt: new Date().toISOString(),
    versions: { ...existing.versions, ...partial.versions },
    libraries,
    scenarios: mergedScenarios,
    summary: {
      totalScenarios: mergedScenarios.length,
      libraryRankings,
      winner: libraryRankings[0]?.library || "",
    },
  };
}

// Format operations per second
function formatOps(ops: number): string {
  if (ops === 0) return "N/A";
  if (ops >= 1e9) return `${(ops / 1e9).toFixed(2)}B ops/s`;
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)}M ops/s`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(2)}K ops/s`;
  return `${ops.toFixed(2)} ops/s`;
}

// Generate ASCII summary table
function generateSummary(results: BenchResult[]): string {
  const grouped: Map<string, BenchResult[]> = new Map();

  results.forEach((result) => {
    const suite = result.suite || "Unknown";
    if (!grouped.has(suite)) {
      grouped.set(suite, []);
    }
    grouped.get(suite)!.push(result);
  });

  let summary = "\n" + colors.bold + "📊 ARKHE BENCHMARK SUMMARY" + colors.reset + "\n";
  summary += "═".repeat(70) + "\n\n";

  const wins: Map<string, number> = new Map();

  grouped.forEach((suiteResults, suiteName) => {
    const sorted = [...suiteResults].sort((a, b) => b.hz - a.hz);
    const winner = sorted[0];
    const winnerLib = extractLibraryName(winner.name);
    wins.set(winnerLib, (wins.get(winnerLib) || 0) + 1);

    summary += `${colors.blue}${suiteName}${colors.reset}\n`;
    sorted.forEach((r, i) => {
      const lib = extractLibraryName(r.name);
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
      const color = i === 0 ? colors.green : colors.gray;
      const ratio = i === 0 ? "" : ` (${(sorted[0].hz / r.hz).toFixed(2)}x slower)`;
      summary += `  ${medal} ${color}${lib.padEnd(20)} ${formatOps(r.hz)}${ratio}${colors.reset}\n`;
    });
    summary += "\n";
  });

  summary += colors.bold + "🏆 OVERALL WINS" + colors.reset + "\n";
  summary += "─".repeat(40) + "\n";

  const sortedWins = Array.from(wins.entries()).sort((a, b) => b[1] - a[1]);
  sortedWins.forEach(([lib, count], i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
    const color = i === 0 ? colors.green : colors.gray;
    summary += `${medal} ${color}${lib.padEnd(20)} ${count} wins${colors.reset}\n`;
  });

  return summary;
}

async function runBenchmark() {
  console.log(colors.yellow + "🚀 Running Arkhe benchmarks..." + colors.reset);

  const args = process.argv.slice(2).filter(arg => arg !== '--');
  let shouldGenerateReport = false;
  let specificFile: string | undefined;

  // Check for --report flag
  const reportIndex = args.indexOf("--report");
  if (reportIndex !== -1) {
    shouldGenerateReport = true;
    args.splice(reportIndex, 1);
  }

  // Check for specific file
  if (args[0] && args[0].endsWith(".ts")) {
    specificFile = args[0];
  }

  console.log(
    colors.blue +
      "ℹ️  Usage: pnpm benchmark:arkhe [options]\n" +
      "    Options:\n" +
      "      <file.bench.ts>     Run specific benchmark file\n" +
      "      --report            Generate JSON report for website\n" +
      colors.reset +
      "\n"
  );

  const command = "pnpm";
  const benchPath = specificFile
    ? `packages/arkhe/benchmarks/${specificFile}`
    : "packages/arkhe/benchmarks";
  const commandArgs = [
    "exec",
    "vitest",
    "bench",
    benchPath,
    "--run",
    "--reporter=default",
    "--color",
  ];

  console.log(colors.gray + `> ${command} ${commandArgs.join(" ")}` + colors.reset + "\n");

  return new Promise<void>((resolve, reject) => {
    let outputBuffer = "";

    const child = spawn(command, commandArgs, {
      stdio: ["inherit", "pipe", "pipe"],
      cwd: process.cwd(),
      env: {
        ...process.env,
        FORCE_COLOR: "1",
        TERM: process.env.TERM || "xterm-256color",
      },
    });

    child.stdout?.on("data", (data) => {
      const output = data.toString();
      outputBuffer += output;
      process.stdout.write(output);
    });

    child.stderr?.on("data", (data) => {
      process.stderr.write(colors.red + data.toString() + colors.reset);
    });

    child.on("close", async (code) => {
      console.log("\n" + colors.blue + "=".repeat(60) + colors.reset);

      const finalResults = parseVitestOutput(outputBuffer);

      if (code === 0) {
        console.log(colors.green + "✅ Benchmark completed successfully!" + colors.reset);
      } else if (finalResults.length > 0) {
        console.log(colors.yellow + `⚠️  Vitest exited with code ${code}, but results were collected` + colors.reset);
      } else {
        console.log(colors.red + `❌ Benchmark failed with code ${code}` + colors.reset);
        reject(new Error(`Benchmark failed with code ${code}`));
        return;
      }

      if (finalResults.length > 0) {
        const summary = generateSummary(finalResults);
        console.log(summary);

        if (shouldGenerateReport) {
          const reportPath = path.resolve(
            process.cwd(),
            "packages/main/website/src/data/benchmarks/arkhe-benchmark.json"
          );

          let report: BenchmarkReport;
          if (specificFile) {
            // Merge mode: update only the re-benchmarked scenarios in the existing report
            try {
              report = await mergeIntoExistingReport(finalResults, reportPath);
              console.log(colors.blue + `\n🔀 Merged results into existing report` + colors.reset);
            } catch {
              // Fallback to full generation if existing report not found
              report = await generateReport(finalResults);
              console.log(colors.yellow + `\n⚠️  No existing report found, generating full report` + colors.reset);
            }
          } else {
            report = await generateReport(finalResults);
          }

          await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
          console.log(
            colors.green + `📄 Report saved to ${reportPath}` + colors.reset
          );
        }
      } else {
        console.log(colors.yellow + "⚠️  No benchmark results parsed" + colors.reset);
      }

      resolve();
    });
  });
}

runBenchmark().catch((err) => {
  console.error(err);
  process.exit(1);
});
