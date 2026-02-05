import React from "react";
import { GeneratedDate, PerfTLDR, VersionsTable, BenchmarkResultsTable, PerformanceSummary, DetailedStats, WeightedSummary } from "@site/src/components/comparisons/BenchmarkTable";
import { arkheConfig } from "./config";
import { BalancedTLDR, BalancedChart, BalancedTable } from "./BalancedSection";

export const ArkheBenchmarkDataMissing = () => <BenchmarkResultsTable config={arkheConfig} />;
export const ArkheGeneratedDate = () => <GeneratedDate config={arkheConfig} />;
export const ArkhePerfTLDR = () => <PerfTLDR config={arkheConfig} />;
export const ArkheVersionsTable = () => <VersionsTable config={arkheConfig} />;
export const ArkheBenchmarkResultsTable = () => <BenchmarkResultsTable config={arkheConfig} />;
export const ArkhePerformanceSummary = () => <PerformanceSummary config={arkheConfig} />;
export const ArkheDetailedStats = () => <DetailedStats config={arkheConfig} />;
export const ArkheWeightedSummary = () => <WeightedSummary config={arkheConfig} />;
export const ArkheBalancedTLDR = () => <BalancedTLDR />;
export const ArkheBalancedChart = () => <BalancedChart />;
export const ArkheBalancedTable = () => <BalancedTable />;
