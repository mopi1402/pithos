import React from "react";
import { GeneratedDate, PerfTLDR, VersionsTable, BenchmarkResultsTable, PerformanceSummary, DetailedStats, WeightedSummary } from "@site/src/components/comparisons/BenchmarkTable";
import { taphosConfig } from "./config";

export const TaphosBenchmarkDataMissing = () => <BenchmarkResultsTable config={taphosConfig} />;
export const TaphosGeneratedDate = () => <GeneratedDate config={taphosConfig} />;
export const TaphosPerfTLDR = () => <PerfTLDR config={taphosConfig} />;
export const TaphosVersionsTable = () => <VersionsTable config={taphosConfig} />;
export const TaphosBenchmarkResultsTable = () => <BenchmarkResultsTable config={taphosConfig} />;
export const TaphosPerformanceSummary = () => <PerformanceSummary config={taphosConfig} />;
export const TaphosDetailedStats = () => <DetailedStats config={taphosConfig} />;
export const TaphosWeightedSummary = () => <WeightedSummary config={taphosConfig} />;
