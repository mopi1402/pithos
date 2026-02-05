import React from "react";

export type CategoryName = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface ScenarioResult {
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

export interface ScenarioData {
  name: string;
  category?: string;
  weight?: number;
  durationMs?: number;
  results: ScenarioResult[];
}

export interface LibrarySummary {
  library: string;
  wins: number;
  totalTests: number;
}

export interface WeightedLibrarySummary {
  library: string;
  weightedScore: number;
  wins: number;
  winsByCategory: Record<CategoryName, number>;
}

export interface BenchmarkReport {
  generatedAt: string;
  benchmarkType?: string;
  versions: Record<string, string>;
  libraries: string[];
  scenarios: ScenarioData[];
  summary: {
    totalScenarios: number;
    libraryRankings: LibrarySummary[];
    winner: string;
    winnerAdvantage?: number | null;
  };
}

export interface LibraryFilterGroup {
  label: string;
  description: string;
  libraries: string[];
}

export interface ModuleConfig<TCategory extends string> {
  name: string;
  primaryLibrary: string;
  benchmarkData: BenchmarkReport | null;
  weights: Record<string, { category: CategoryName; reason: string }>;
  categoryLabels: Record<TCategory, string>;
  functionToCategory: Record<string, TCategory>;
  categoryOrder: TCategory[];
  libraryDescriptions: Record<string, string>;
  excludedLibraries: string[];
  quasiEquivalentFunctions?: Record<string, React.ReactNode>;
  nonEquivalentFunctions?: string[];
  nativenessLevel?: Record<string, 'native' | 'composition' | 'custom'>;
  /** Custom note to display when native result is absent for a utility (e.g. "ES2022+" → "N/A – ES2022+") */
  nativeUnavailableNote?: Record<string, string>;
  tldrContent: (data: BenchmarkReport) => React.ReactNode;
  generateCommand: string;
  libraryFilter?: {
    groups: Record<string, LibraryFilterGroup>;
  };
  scenarioFilter?: (scenario: ScenarioData) => boolean;
  formatTestName?: (name: string) => string;
  stickyHeaderOffset?: number;
}
