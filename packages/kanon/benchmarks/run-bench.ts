#!/usr/bin/env node
import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";
import { BENCH_LIB_HINTS } from "./dataset/config";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  darkGreen: "\x1b[32;2m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  // Truecolor backgrounds for categories (RGB)
  bgCritical: "\x1b[48;2;255;100;100m\x1b[30m", // Red bg + black text
  bgHigh: "\x1b[48;2;255;200;100m\x1b[30m",     // Orange/yellow bg + black text
  bgMedium: "\x1b[48;2;100;180;255m\x1b[30m",   // Blue bg + black text
};

interface BenchResult {
  name: string;
  hz: number;
  suite?: string;
  rank?: number;
  // Detailed stats
  min?: number;
  max?: number;
  mean?: number;
  p75?: number;
  p99?: number;
  p995?: number;
  p999?: number;
  rme?: string; // relative margin of error (e.g., "±0.22%")
  samples?: number;
}

type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "OTHER";

interface CategoryConfig {
  name: CategoryName;
  weight: number;
  patterns: string[];
}

const CATEGORIES: CategoryConfig[] = [
  { name: "CRITICAL", weight: 5, patterns: ["Login Form", "User Registration", "Payment Form"] },
  { name: "HIGH", weight: 4, patterns: ["API Response", "E-commerce", "Blog Post", "Event Booking", "Invalid Login"] },
  { name: "MEDIUM", weight: 3, patterns: ["Search Params", "User Profile"] },
];

interface ScenarioResult {
  library: string;
  opsPerSecond: number;
  rank: number;
  ratio: number;
  isFastest: boolean;
  // Detailed stats for transparency
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
  category: CategoryName;
  weight: number;
  durationMs: number;
  results: ScenarioResult[];
}

interface LibrarySummary {
  library: string;
  wins: number;
  weightedScore: number;
}

interface BenchmarkReport {
  generatedAt: string;
  benchmarkType: string;
  versions: Record<string, string>;
  libraries: string[];
  scenarios: ScenarioData[];
  summary: {
    totalScenarios: number;
    libraryRankings: LibrarySummary[];
    winner: string;
    winnerAdvantage: number | null; // ratio vs second place
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

// Get visual width of a string (accounting for wide characters like emojis)
function getVisualWidth(str: string): number {
  const stripped = stripAnsiCodes(str);
  let width = 0;
  for (const char of stripped) {
    const code = char.codePointAt(0) || 0;
    // Emojis and other wide characters (rough heuristic)
    if (code > 0x1F000 || // Most emojis
        (code >= 0x2600 && code <= 0x27BF) || // Misc symbols
        (code >= 0x2300 && code <= 0x23FF) || // Misc technical
        (code >= 0x2B50 && code <= 0x2B55) || // Stars etc
        (code >= 0x274C && code <= 0x274E) || // Cross marks
        (code >= 0x2705 && code <= 0x2705)) { // Check mark
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

// Pad string to specific length (accounting for wide characters like emojis)
function padRight(str: string, len: number): string {
  const visibleLength = getVisualWidth(str);
  const padding = len - visibleLength;
  return str + " ".repeat(Math.max(0, padding));
}

// Extract library name from test name
function extractLibraryName(testName: string): string {
  if (testName.includes("@kanon/V3.0")) return "@kanon/V3.0";
  if (testName.includes("@kanon/JIT")) return "@kanon/JIT";
  if (testName.includes("Zod")) return "Zod";
  if (testName.includes("Valibot")) return "Valibot";
  return testName.split(" - ")[0] || testName;
}

// Remove ANSI color codes from string
function stripAnsiCodes(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

// Parse Vitest benchmark output
function parseVitestOutput(output: string): BenchResult[] {
  const results: BenchResult[] = [];
  const cleanOutput = stripAnsiCodes(output);
  const lines = cleanOutput.split("\n");

  let currentSuite = "";

  for (const line of lines) {
    // Detect suite name
    if (line.includes(" > ") && !line.includes("ops/sec")) {
      const parts = line.split(" > ");
      currentSuite = parts[parts.length - 1].trim();
    }

    // Parse benchmark result lines with full stats
    // Format: "   · @kanon/V2    9,199,127.47  0.0000  3.6820  0.0001  0.0001  0.0001  0.0002  0.0032  ±1.62%  4599564"
    //         name              hz            min     max     mean    p75     p99     p995    p999    rme     samples
    const fullMatch = line.match(
      /^\s*·\s+(.+?)\s+([\d,]+(?:\.\d+)?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(±[\d.]+%)\s+(\d+)/
    );
    if (fullMatch) {
      const [, name, hz, min, max, mean, p75, p99, p995, p999, rme, samples] = fullMatch;
      results.push({
        name: name.trim(),
        hz: parseFloat(hz.replace(/,/g, "")),
        suite: currentSuite,
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
      const name = simpleMatch[1].trim();
      const ops = parseFloat(simpleMatch[2].replace(/,/g, ""));

      results.push({
        name,
        hz: ops,
        suite: currentSuite,
      });
    }

    // Alternative format from Vitest bench reporter
    // Format: "name      1234567 ops/s"
    const altMatch = line.match(/^\s*(.+?)\s+([\d.]+(?:[KMB])?\s+ops\/s)/);
    if (altMatch && !line.includes("×")) {
      const name = altMatch[1].trim();
      const opsStr = altMatch[2];

      let ops = 0;
      if (opsStr.includes("K")) {
        ops = parseFloat(opsStr) * 1e3;
      } else if (opsStr.includes("M")) {
        ops = parseFloat(opsStr) * 1e6;
      } else if (opsStr.includes("B")) {
        ops = parseFloat(opsStr) * 1e9;
      } else {
        ops = parseFloat(opsStr);
      }

      results.push({
        name,
        hz: ops,
        suite: currentSuite,
      });
    }
  }

  return results;
}

// Get package versions from node_modules
async function getPackageVersions(): Promise<Record<string, string>> {
  const packages: Record<string, string> = {
    "zod": "zod",
    "valibot": "valibot",
    "superstruct": "superstruct",
    "fastest-validator": "fastest-validator",
    "@sinclair/typebox": "@sinclair/typebox",
    "ajv": "ajv",
  };

  const versions: Record<string, string> = {};

  // Add Kanon version from pithos package
  try {
    const pithosPath = path.resolve(process.cwd(), "packages/pithos/package.json");
    const pithosContent = await fs.readFile(pithosPath, "utf-8");
    const pithosJson = JSON.parse(pithosContent);
    versions["kanon"] = pithosJson.version || "unknown";
  } catch {
    versions["kanon"] = "unknown";
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
async function generateReport(results: BenchResult[], benchmarkType: string): Promise<BenchmarkReport> {
  // Get package versions
  const versions = await getPackageVersions();

  // Group results by suite, keeping full BenchResult
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

  // Helper to get category for a scenario
  const getCategory = (scenarioName: string): { name: CategoryName; weight: number } => {
    for (const cat of CATEGORIES) {
      if (cat.patterns.some(p => scenarioName.includes(p))) {
        return { name: cat.name, weight: cat.weight };
      }
    }
    return { name: "OTHER", weight: 1 };
  };

  // Helper to extract duration from suite name (e.g., "🔐 Login Form Validation 4689ms")
  const extractDuration = (suiteName: string): number => {
    const match = suiteName.match(/\s+(\d+)ms$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Build scenarios data
  const scenarios: ScenarioData[] = [];
  const winsCount: Map<string, number> = new Map();
  const weightedScores: Map<string, number> = new Map();

  libraries.forEach(lib => {
    winsCount.set(lib, 0);
    weightedScores.set(lib, 0);
  });

  grouped.forEach((suiteResults, suiteName) => {
    const maxOps = Math.max(...suiteResults.map(r => r.hz));
    const sorted = [...suiteResults].sort((a, b) => b.hz - a.hz);
    
    const cleanName = cleanScenarioName(suiteName);
    const category = getCategory(cleanName);
    const duration = extractDuration(suiteName);

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
      name: cleanName,
      category: category.name,
      weight: category.weight,
      durationMs: duration,
      results: scenarioResults,
    });

    // Track wins and weighted scores
    if (sorted.length > 0) {
      const winner = extractLibraryName(sorted[0].name);
      winsCount.set(winner, (winsCount.get(winner) || 0) + 1);
      
      // Only count weighted score if not a draw (ratio >= 1.1)
      if (sorted.length > 1) {
        const winnerOps = sorted[0].hz;
        const secondOps = sorted[1].hz;
        if (winnerOps / secondOps >= 1.1) {
          weightedScores.set(winner, (weightedScores.get(winner) || 0) + category.weight);
        }
      } else {
        weightedScores.set(winner, (weightedScores.get(winner) || 0) + category.weight);
      }
    }
  });

  // Build library rankings
  const libraryRankings: LibrarySummary[] = libraries
    .map(lib => ({
      library: lib,
      wins: winsCount.get(lib) || 0,
      weightedScore: weightedScores.get(lib) || 0,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore || b.wins - a.wins);

  // Calculate winner advantage
  let winnerAdvantage: number | null = null;
  if (libraryRankings.length >= 2 && libraryRankings[1].weightedScore > 0) {
    winnerAdvantage = parseFloat((libraryRankings[0].weightedScore / libraryRankings[1].weightedScore).toFixed(2));
  }

  return {
    generatedAt: new Date().toISOString(),
    benchmarkType,
    versions,
    libraries,
    scenarios,
    summary: {
      totalScenarios: scenarios.length,
      libraryRankings,
      winner: libraryRankings[0]?.library || "",
      winnerAdvantage,
    },
  };
}

// Clean scenario name (remove emojis and timing info)
function cleanScenarioName(name: string): string {
  return name
    .replace(/^\s*[^\w\s]+\s*/, "") // Remove leading emojis
    .replace(/\s+\d+ms$/, "") // Remove timing suffix
    .trim();
}

// Generate ASCII table
function generateTable(results: BenchResult[]): string {
  // Group results by suite
  const grouped: Map<string, Map<string, number>> = new Map();

  results.forEach((result) => {
    const libName = extractLibraryName(result.name);
    const suite = result.suite || "Unknown";

    if (!grouped.has(suite)) {
      grouped.set(suite, new Map());
    }

    grouped.get(suite)!.set(libName, result.hz);
  });

  // Get all libraries
  const libraries = Array.from(
    new Set(Array.from(grouped.values()).flatMap((m) => Array.from(m.keys())))
  ).sort();

  if (libraries.length === 0) {
    return "No benchmark results found";
  }

  // Calculate column widths
  // Use actual max test name length, no minimum padding
  const maxTestNameLength = Math.max(...Array.from(grouped.keys()).map((k) => getVisualWidth(k)));
  const testColWidth = maxTestNameLength;
  
  // Min 15 chars to fit "999.99M ops/s", "(fastest)" and "(99.99x)" labels with padding
  const libColWidth = Math.max(...libraries.map((l) => l.length), 15);

  // Build the table
  let table =
    "\n" + colors.bold + "📊 BENCHMARK RESULTS TABLE" + colors.reset + "\n";

  // Top border
  table += "╔" + "═".repeat(testColWidth + 2) + "╤";
  table += libraries.map(() => "═".repeat(libColWidth + 2)).join("╤") + "╗\n";

  // Header row
  table +=
    "║ " + padRight(colors.bold + "Test" + colors.reset, testColWidth) + " │ ";
  table +=
    libraries
      .map((l) => padRight(colors.bold + l + colors.reset, libColWidth))
      .join(" │ ") + " ║\n";

  // Header separator
  table += "╠" + "═".repeat(testColWidth + 2) + "╪";
  table += libraries.map(() => "═".repeat(libColWidth + 2)).join("╪") + "╣\n";

  // Define category mappings for the main table
  const testCategories: Array<{ patterns: string[]; name: string; weight: number; bgColor: string }> = [
    { patterns: ["Login Form", "User Registration", "Payment Form"], name: "CRITICAL", weight: 5, bgColor: colors.bgCritical },
    { patterns: ["API Response", "E-commerce", "Blog Post", "Event Booking", "Invalid Login"], name: "HIGH", weight: 4, bgColor: colors.bgHigh },
    { patterns: ["Search Params", "User Profile"], name: "MEDIUM", weight: 3, bgColor: colors.bgMedium },
  ];

  const getTestCategory = (testName: string): { name: string; weight: number; bgColor: string } | null => {
    for (const cat of testCategories) {
      if (cat.patterns.some(p => testName.includes(p))) {
        return { name: cat.name, weight: cat.weight, bgColor: cat.bgColor };
      }
    }
    return null;
  };

  // Data rows
  let rowIndex = 0;
  grouped.forEach((libResults, testName) => {
    const values = libraries.map((lib) => libResults.get(lib) || 0);
    const maxValue = Math.max(...values);

    // Find the second highest value
    const sortedValues = [...values].filter((v) => v > 0).sort((a, b) => b - a);
    const secondMaxValue = sortedValues.length > 1 ? sortedValues[1] : 0;

    // Check if it's a draw (ratio < 1.1)
    const isDraw = secondMaxValue > 0 && (maxValue / secondMaxValue) < 1.1;

    // Extract time from test name (e.g., "🔐 Login Form Validation 2707ms")
    const timeMatch = testName.match(/\s+(\d+)ms$/);
    const timeStr = timeMatch ? timeMatch[1] : '';
    const cleanTestName = timeMatch ? testName.replace(/\s+\d+ms$/, '') : testName;

    // Get category info
    const category = getTestCategory(cleanTestName);

    // Main row with ops/s
    table +=
      "║ " +
      padRight(cleanTestName.substring(0, testColWidth), testColWidth) +
      " │ ";
    table += libraries
      .map((lib, i) => {
        const value = values[i];
        const formatted = formatOps(value);
        const isMax = value === maxValue && value > 0;
        const isSecond =
          value === secondMaxValue && value > 0 && value !== maxValue;

        let cell = formatted;
        if (isMax) {
          cell = `${colors.green}${formatted}${colors.reset}`;
        } else if (isSecond && isDraw) {
          // Draw: both are green
          cell = `${colors.green}${formatted}${colors.reset}`;
        } else if (isSecond) {
          cell = `${colors.darkGreen}${formatted}${colors.reset}`;
        }

        return padRight(cell, libColWidth);
      })
      .join(" │ ");
    table += " ║" + (isDraw ? ` ${colors.green}≈${colors.reset}` : "") + "\n";

    // Comparison row (relative to fastest) + category/points/time on the left
    if (maxValue > 0) {
      let leftInfo = '';
      if (category && timeStr) {
        leftInfo = `${category.bgColor} ${category.name} | ${category.weight} pts ${colors.reset} ${colors.gray}${timeStr}ms${colors.reset}`;
      } else if (timeStr) {
        leftInfo = `${colors.gray}${timeStr}ms${colors.reset}`;
      }
      table += "║ " + padRight(leftInfo, testColWidth) + " │ ";
      table += libraries
        .map((lib, i) => {
          const value = values[i];
          if (value === maxValue) {
            return padRight(
              `${colors.gray}(fastest)${colors.reset}`,
              libColWidth
            );
          } else if (value > 0) {
            const ratio = (maxValue / value).toFixed(2);
            return padRight(
              `${colors.gray}(${ratio}x)${colors.reset}`,
              libColWidth
            );
          } else {
            return " ".repeat(libColWidth);
          }
        })
        .join(" │ ");
      table += " ║\n";
    }

    // Row separator (except for last row)
    rowIndex++;
    if (rowIndex < grouped.size) {
      table += "╟" + "─".repeat(testColWidth + 2) + "┼";
      table +=
        libraries.map(() => "─".repeat(libColWidth + 2)).join("┼") + "╢\n";
    }
  });

  // Bottom border
  table += "╚" + "═".repeat(testColWidth + 2) + "╧";
  table += libraries.map(() => "═".repeat(libColWidth + 2)).join("╧") + "╝\n";

  // Generate summary
  table += "\n" + colors.bold + "📊 PERFORMANCE SUMMARY" + colors.reset + "\n";
  table += "═".repeat(70) + "\n";

  const wins: Map<string, number> = new Map();
  libraries.forEach((lib) => wins.set(lib, 0));

  grouped.forEach((libResults) => {
    const values = Array.from(libResults.entries());
    if (values.length > 0) {
      const fastest = values.reduce((a, b) => (a[1] > b[1] ? a : b));
      wins.set(fastest[0], (wins.get(fastest[0]) || 0) + 1);
    }
  });

  const sortedWins = Array.from(wins.entries()).sort((a, b) => b[1] - a[1]);
  const totalTests = grouped.size;
  const barWidth = 30;
  const maxLibNameLengthSummary = Math.max(...libraries.map(lib => lib.length)) + 1; // +1 for the colon
  
  sortedWins.forEach(([lib, count], index) => {
    const medal =
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
    const barFilled = Math.round((count / totalTests) * barWidth);
    const bar = "█".repeat(barFilled) + "░".repeat(barWidth - barFilled);
    const countStr = String(count).padStart(2, " ");
    table += `${medal} ${padRight(lib + ":", maxLibNameLengthSummary)} ${countStr} wins ${
      colors.blue
    }${bar}${colors.reset}\n`;
  });

  // Define test categories for weighted summary
  const categories: Array<{
    name: string;
    weight: number;
    patterns: string[];
  }> = [
    { name: "CRITICAL", weight: 5, patterns: ["Login Form Validation", "User Registration", "Payment Form"] },
    { name: "HIGH", weight: 4, patterns: ["API Response", "E-commerce Product", "Blog Post", "Event Booking", "Invalid Login"] },
    { name: "MEDIUM", weight: 3, patterns: ["Search Params", "User Profile Update"] },
  ];

  // Helper to find test by pattern
  const findTestByPattern = (pattern: string): [string, Map<string, number>] | undefined => {
    for (const [testName, libResults] of grouped.entries()) {
      if (testName.includes(pattern)) {
        return [testName, libResults];
      }
    }
    return undefined;
  };

  // Calculate winner for a test
  const getWinner = (libResults: Map<string, number>): { winner: string; ratio: number } | null => {
    const entries = Array.from(libResults.entries()).filter(([, ops]) => ops > 0);
    if (entries.length < 2) return null;
    
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const [winner, winnerOps] = sorted[0];
    const [, loserOps] = sorted[1];
    
    return { winner, ratio: winnerOps / loserOps };
  };

  // Final weighted summary
  table += "\n" + colors.bold + "📈 WEIGHTED SUMMARY" + colors.reset + "\n";
  table += "═".repeat(70) + "\n\n";

  // Calculate overall weighted score
  const weightedWins: Map<string, number> = new Map();
  let totalDrawWeight = 0;
  libraries.forEach((lib) => weightedWins.set(lib, 0));

  for (const category of categories) {
    for (const pattern of category.patterns) {
      const found = findTestByPattern(pattern);
      if (!found) continue;

      const [_, libResults] = found;
      const result = getWinner(libResults);
      if (!result) continue;

      // Only count if ratio >= 1.1 (not a draw)
      if (result.ratio >= 1.1) {
        const currentScore = weightedWins.get(result.winner) || 0;
        weightedWins.set(result.winner, currentScore + category.weight);
      } else {
        totalDrawWeight += category.weight;
      }
    }
  }

  const totalWeightedPoints = Array.from(weightedWins.values()).reduce((a, b) => a + b, 0);
  const sortedWeightedWins = Array.from(weightedWins.entries())
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  // Calculate max library name length for alignment
  const maxLibNameLength = Math.max(...libraries.map(lib => lib.length));

  if (sortedWeightedWins.length === 0) {
    // All tests are draws
    table += `${colors.gray}All tests are draws (~equal performance between libraries)${colors.reset}\n`;
    table += `${colors.gray}Total draw weight: ${totalDrawWeight} pts${colors.reset}\n`;
  } else if (sortedWeightedWins.length === 1) {
    // Only one library has wins
    const [first, firstScore] = sortedWeightedWins[0];
    table += `${colors.green}🏆 ${first}${colors.reset} wins all decisive tests!\n\n`;
    table += `   ${padRight(first, maxLibNameLength)} ${colors.green}${"█".repeat(40)}${colors.reset} 100% (${firstScore} pts)\n`;
    
    // Show other libraries with 0 points
    for (const lib of libraries) {
      if (lib !== first) {
        table += `   ${padRight(lib, maxLibNameLength)} ${colors.gray}${"░".repeat(40)}${colors.reset}   0% (0 pts)\n`;
      }
    }
    
    if (totalDrawWeight > 0) {
      table += `   ${colors.gray}Draws: ${totalDrawWeight} pts${colors.reset}\n`;
    }
  } else {
    // Multiple libraries have wins
    const [first, firstScore] = sortedWeightedWins[0];
    const [second, secondScore] = sortedWeightedWins[1];
    
    const firstPct = String(((firstScore / totalWeightedPoints) * 100).toFixed(0)).padStart(3, " ");
    const secondPct = String(((secondScore / totalWeightedPoints) * 100).toFixed(0)).padStart(3, " ");
    const advantage = (firstScore / secondScore).toFixed(2);

    table += `${colors.green}🏆 ${first}${colors.reset} dominates real-world scenarios!\n\n`;
    
    const bar1Filled = Math.round((firstScore / totalWeightedPoints) * 40);
    const bar2Filled = Math.round((secondScore / totalWeightedPoints) * 40);
    const bar1 = "█".repeat(bar1Filled) + "░".repeat(40 - bar1Filled);
    const bar2 = "█".repeat(bar2Filled) + "░".repeat(40 - bar2Filled);
    
    table += `   ${padRight(first, maxLibNameLength)} ${colors.green}${bar1}${colors.reset} ${firstPct}% (${firstScore} pts)\n`;
    table += `   ${padRight(second, maxLibNameLength)} ${colors.yellow}${bar2}${colors.reset} ${secondPct}% (${secondScore} pts)\n`;
    
    // Show other libraries if any
    for (let i = 2; i < sortedWeightedWins.length; i++) {
      const [lib, score] = sortedWeightedWins[i];
      const pct = String(((score / totalWeightedPoints) * 100).toFixed(0)).padStart(3, " ");
      const barFilled = Math.round((score / totalWeightedPoints) * 40);
      const bar = "█".repeat(barFilled) + "░".repeat(40 - barFilled);
      table += `   ${padRight(lib, maxLibNameLength)} ${colors.gray}${bar}${colors.reset} ${pct}% (${score} pts)\n`;
    }
    
    // Show libraries with 0 points
    for (const lib of libraries) {
      if (!weightedWins.get(lib) || weightedWins.get(lib) === 0) {
        table += `   ${padRight(lib, maxLibNameLength)} ${colors.gray}${"░".repeat(40)}${colors.reset}   0% (0 pts)\n`;
      }
    }
    
    if (totalDrawWeight > 0) {
      table += `   ${colors.gray}Draws: ${totalDrawWeight} pts${colors.reset}\n`;
    }
    
    table += `\n   ${colors.bold}On critical + high priority tasks, ${first} is ${advantage}x ahead${colors.reset}\n`;
  }

  return table;
}

async function runBenchmark() {
  console.log(colors.yellow + "🚀 Running benchmarks..." + colors.reset);

  // Get command line arguments (filter out "--" separator)
  const args = process.argv.slice(2).filter(arg => arg !== '--');
  let benchFile = "comparison.bench.ts";
  let libsArg: string | undefined;
  let shouldGenerateReport = false;

  // Check for --report flag
  const reportIndex = args.indexOf("--report");
  if (reportIndex !== -1) {
    shouldGenerateReport = true;
    args.splice(reportIndex, 1);
  }

  console.log(
    colors.blue +
      "ℹ️  Usage: pnpm benchmark:kanon [options]\n" +
      "    Options:\n" +
      "      realworld           Run real-world scenarios only\n" +
      "      <libs>              Filter libraries: kanon,zod,valibot\n" +
      "      <file.bench.ts>     Run specific benchmark file\n" +
      "      --report            Generate JSON report for website\n" +
      "    Available libraries: " +
      BENCH_LIB_HINTS.join(" | ") +
      colors.reset +
      "\n"
  );

  // Handle shortcuts
  if (args[0] === "realworld" || args[0] === "real" || args[0] === "rw") {
    benchFile = "realworld.bench.ts";
    args.shift(); // Remove the shortcut from args
  }

  if (args[0]) {
    if (args[0].includes(".ts")) {
      benchFile = args[0];
    } else {
      libsArg = args[0];
    }
  }

  if (args[1] && !benchFile) {
    benchFile = args[1];
  } else if (args[1] && libsArg) {
    benchFile = args[1];
  }

  // Debug: show parsed libs
  if (libsArg) {
    console.log(colors.gray + `📚 Libraries filter: ${libsArg}` + colors.reset);
  }

  const additionalArgs = args.slice(libsArg ? 1 : benchFile !== "comparison.bench.ts" ? 1 : 0);

  // Build the command
  const command = "pnpm";
  const commandArgs = [
    "exec",
    "vitest",
    "bench",
    benchFile,
    ...additionalArgs,
    "--reporter=default",
    "--color", // Force color output
    "--run", // Run once and exit (no watch mode)
    "--exclude", "**/.stryker-tmp/**", // Exclude Stryker sandbox directories
  ];

  console.log(
    colors.gray + `> ${command} ${commandArgs.join(" ")}` + colors.reset + "\n"
  );

  return new Promise<void>((resolve, reject) => {
    let outputBuffer = "";
    let results: BenchResult[] = [];

    // Spawn the process
    const child = spawn(command, commandArgs, {
      stdio: ["inherit", "pipe", "pipe"],
      cwd: process.cwd(),
      env: {
        ...process.env,
        BENCH_LIBS: libsArg ?? process.env.BENCH_LIBS,
        FORCE_COLOR: "1", // Force color output
        NO_COLOR: undefined, // Remove any NO_COLOR setting
        TERM: process.env.TERM || "xterm-256color", // Ensure terminal type
      },
    });

    // Handle stdout - display in real-time and collect for parsing
    child.stdout?.on("data", (data) => {
      const output = data.toString();
      outputBuffer += output;

      // Display output in real-time with preserved colors
      process.stdout.write(output);

      // Try to parse results incrementally
      const newResults = parseVitestOutput(outputBuffer);
      if (newResults.length > results.length) {
        results = newResults;
      }
    });

    // Handle stderr
    child.stderr?.on("data", (data) => {
      const error = data.toString();
      process.stderr.write(colors.red + error + colors.reset);
    });

    // Handle process completion
    child.on("close", async (code) => {
      console.log("\n" + colors.blue + "=".repeat(60) + colors.reset);

      if (code === 0) {
        console.log(
          colors.green + "✅ Benchmark completed successfully!" + colors.reset
        );

        // Parse final results
        const finalResults = parseVitestOutput(outputBuffer);

        if (finalResults.length > 0) {
          const table = generateTable(finalResults);
          console.log(table);

          // Generate JSON report for website if --report flag is set
          if (shouldGenerateReport) {
            const benchmarkType = benchFile.replace(".bench.ts", "");
            const report = await generateReport(finalResults, benchmarkType);
            const reportPath = path.resolve(
              process.cwd(),
              `packages/main/website/src/data/kanon-benchmark-${benchmarkType}.json`
            );
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            console.log(
              colors.green +
                `\n📄 Report saved to ${reportPath}` +
                colors.reset
            );
          }

          // Optional: Save results to file
          if (process.env.BENCH_SAVE_RESULTS) {
            const resultsPath = path.join(
              process.cwd(),
              "benchmark-results.json"
            );
            await fs.writeFile(
              resultsPath,
              JSON.stringify(finalResults, null, 2)
            );
            console.log(
              colors.green +
                `\n✅ Results saved to ${resultsPath}` +
                colors.reset
            );
          }
        } else {
          console.log(
            colors.yellow +
              "\n⚠️  No benchmark results found in output" +
              colors.reset
          );
        }

        resolve();
      } else {
        console.error(
          colors.red +
            `\n❌ Benchmark failed with exit code ${code}` +
            colors.reset
        );
        reject(new Error(`Benchmark process exited with code ${code}`));
      }
    });

    // Handle process errors
    child.on("error", (error) => {
      console.error(
        colors.red + "\n❌ Error running benchmarks:" + colors.reset,
        error
      );
      reject(error);
    });

    // Handle Ctrl+C gracefully
    process.on("SIGINT", () => {
      console.log(
        colors.yellow + "\n\n🛑 Stopping benchmark..." + colors.reset
      );
      child.kill("SIGINT");
      process.exit(0);
    });
  });
}

// Run the benchmark
runBenchmark().catch(console.error);
