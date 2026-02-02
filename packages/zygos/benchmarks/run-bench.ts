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

// Extract library name from test name
function extractLibraryName(testName: string): string {
  if (testName.includes("zygos/")) return "zygos";
  if (testName.includes("neverthrow/")) return "neverthrow";
  return testName;
}

// Parse Vitest benchmark output
function parseVitestOutput(output: string): BenchResult[] {
  const results: BenchResult[] = [];
  const cleanOutput = stripAnsiCodes(output);
  const lines = cleanOutput.split("\n");

  let currentSuite = "";

  for (const line of lines) {
    // Detect file being tested
    const fileMatch = line.match(/[✓✗]\s+packages\/zygos\/benchmarks\/(.+?)\.bench\.ts\s+>\s+(.+?)\s+\d+ms/);
    if (fileMatch) {
      currentSuite = fileMatch[2];
      continue;
    }

    // Parse benchmark result lines with full stats
    const fullMatch = line.match(
      /^\s*·\s+(.+?)\s+([\d,]+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(±[\d.]+%)\s+(\d+)/
    );
    if (fullMatch) {
      const [, name, hz, min, max, mean, p75, p99, p995, p999, rme, samples] = fullMatch;
      results.push({
        name: name.trim(),
        hz: parseFloat(hz.replace(/,/g, "")),
        suite: currentSuite || "Unknown",
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
        suite: currentSuite || "Unknown",
      });
    }
  }

  return results;
}

// Get package versions from node_modules
async function getPackageVersions(): Promise<Record<string, string>> {
  const versions: Record<string, string> = {};

  // Add zygos version from pithos package
  try {
    const pithosPath = path.resolve(process.cwd(), "packages/pithos/package.json");
    const pithosContent = await fs.readFile(pithosPath, "utf-8");
    const pithosJson = JSON.parse(pithosContent);
    versions["zygos"] = pithosJson.version || "unknown";
  } catch {
    versions["zygos"] = "unknown";
  }

  // Get neverthrow version
  try {
    const pkgPath = path.resolve(process.cwd(), "node_modules/neverthrow/package.json");
    const content = await fs.readFile(pkgPath, "utf-8");
    const json = JSON.parse(content);
    versions["neverthrow"] = json.version || "unknown";
  } catch {
    versions["neverthrow"] = "unknown";
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
    new Set(results.map((r) => extractLibraryName(r.name)))
  ).sort();

  // Build scenarios data
  const scenarios: ScenarioData[] = [];
  const winsCount: Map<string, number> = new Map();

  libraries.forEach((lib) => winsCount.set(lib, 0));

  grouped.forEach((suiteResults, suiteName) => {
    const maxOps = Math.max(...suiteResults.map((r) => r.hz));
    const sorted = [...suiteResults].sort((a, b) => b.hz - a.hz);

    const scenarioResults: ScenarioResult[] = sorted.map((result, index) => ({
      library: extractLibraryName(result.name),
      opsPerSecond: Math.round(result.hz),
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
      name: suiteName,
      results: scenarioResults,
    });

    // Track wins
    if (sorted.length > 0) {
      const winner = extractLibraryName(sorted[0].name);
      winsCount.set(winner, (winsCount.get(winner) || 0) + 1);
    }
  });

  // Sort scenarios alphabetically
  scenarios.sort((a, b) => a.name.localeCompare(b.name));

  // Build library rankings
  const libraryRankings: LibrarySummary[] = libraries
    .map((lib) => ({
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

  let summary = "\n" + colors.bold + "📊 ZYGOS BENCHMARK SUMMARY" + colors.reset + "\n";
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
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "  ";
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
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "  ";
    const color = i === 0 ? colors.green : colors.gray;
    summary += `${medal} ${color}${lib.padEnd(20)} ${count} wins${colors.reset}\n`;
  });

  return summary;
}

async function runBenchmark() {
  console.log(colors.yellow + "🚀 Running Zygos benchmarks..." + colors.reset);

  const args = process.argv.slice(2).filter((arg) => arg !== "--");
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
      "ℹ️  Usage: pnpm benchmark:zygos [options]\n" +
      "    Options:\n" +
      "      <file.bench.ts>     Run specific benchmark file\n" +
      "      --report            Generate JSON report for website\n" +
      colors.reset +
      "\n"
  );

  const command = "pnpm";
  const commandArgs = [
    "exec",
    "vitest",
    "bench",
    specificFile || "packages/zygos/benchmarks",
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

      if (code === 0) {
        console.log(colors.green + "✅ Benchmark completed successfully!" + colors.reset);

        const finalResults = parseVitestOutput(outputBuffer);

        if (finalResults.length > 0) {
          const summary = generateSummary(finalResults);
          console.log(summary);

          if (shouldGenerateReport) {
            const report = await generateReport(finalResults);
            const reportPath = path.resolve(
              process.cwd(),
              "packages/main/website/src/data/zygos-benchmark.json"
            );
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            console.log(colors.green + `\n📄 Report saved to ${reportPath}` + colors.reset);
          }
        } else {
          console.log(colors.yellow + "⚠️  No benchmark results parsed" + colors.reset);
        }

        resolve();
      } else {
        console.log(colors.red + `❌ Benchmark failed with code ${code}` + colors.reset);
        reject(new Error(`Benchmark failed with code ${code}`));
      }
    });
  });
}

runBenchmark().catch((err) => {
  console.error(err);
  process.exit(1);
});
