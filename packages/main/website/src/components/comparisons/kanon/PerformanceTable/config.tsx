import React from "react";
import { translate } from "@docusaurus/Translate";
import {
  ModuleConfig,
  BenchmarkReport,
} from "@site/src/components/comparisons/BenchmarkTable";
import styles from "./styles.module.css";

let benchmarkData: BenchmarkReport | null = null;
try {
  benchmarkData = require("@site/src/data/benchmarks/kanon-benchmark-realworld.json");
} catch {
  benchmarkData = null;
}

export type KanonCategory = "CRITICAL" | "HIGH" | "MEDIUM" | "OTHER";

export const kanonConfig: ModuleConfig<KanonCategory> = {
  name: "kanon",
  primaryLibrary: "@kanon/V3.0",
  benchmarkData,
  weights: {
    "Login Form Validation": { category: "CRITICAL", reason: "Core authentication flow" },
    "User Registration (with password confirm)": { category: "CRITICAL", reason: "Core registration flow" },
    "Payment Form (conditional validation)": { category: "CRITICAL", reason: "Payment processing validation" },
    "API Response (discriminated union)": { category: "HIGH", reason: "Common API response handling" },
    "E-commerce Product": { category: "HIGH", reason: "Product data validation" },
    "Blog Post with Comments": { category: "HIGH", reason: "Content with nested data" },
    "Event Booking": { category: "HIGH", reason: "Booking form validation" },
    "Invalid Login (error handling)": { category: "HIGH", reason: "Error path validation" },
    "Search Params (with coercion)": { category: "MEDIUM", reason: "Query parameter validation" },
    "User Profile Update (optional fields)": { category: "MEDIUM", reason: "Optional field handling" },
  },
  categoryLabels: {
    CRITICAL: translate({ id: 'comparison.kanon.category.critical', message: 'Critical' }),
    HIGH: translate({ id: 'comparison.kanon.category.high', message: 'High' }),
    MEDIUM: translate({ id: 'comparison.kanon.category.medium', message: 'Medium' }),
    OTHER: translate({ id: 'comparison.kanon.category.other', message: 'Other' }),
  },
  functionToCategory: {
    "Login Form Validation": "CRITICAL",
    "User Registration (with password confirm)": "CRITICAL",
    "Payment Form (conditional validation)": "CRITICAL",
    "API Response (discriminated union)": "HIGH",
    "E-commerce Product": "HIGH",
    "Blog Post with Comments": "HIGH",
    "Event Booking": "HIGH",
    "Invalid Login (error handling)": "HIGH",
    "Search Params (with coercion)": "MEDIUM",
    "User Profile Update (optional fields)": "MEDIUM",
  },
  categoryOrder: ["CRITICAL", "HIGH", "MEDIUM", "OTHER"],
  libraryDescriptions: {
    kanon: translate({ id: 'comparison.kanon.lib.kanon', message: 'Pithos validation module (schema-first + JIT)' }),
    zod: translate({ id: 'comparison.kanon.lib.zod', message: 'Schema-first validation with TypeScript inference' }),
    valibot: translate({ id: 'comparison.kanon.lib.valibot', message: 'Modular schema validation, tree-shakable' }),
    superstruct: translate({ id: 'comparison.kanon.lib.superstruct', message: 'Composable validation with custom types' }),
    ajv: translate({ id: 'comparison.kanon.lib.ajv', message: 'JSON Schema validator with JIT compilation' }),
    "@sinclair/typebox": translate({ id: 'comparison.kanon.lib.typebox', message: 'JSON Schema with TypeScript inference + JIT' }),
    "fastest-validator": translate({ id: 'comparison.kanon.lib.fastestValidator', message: 'High-performance validator with JIT' }),
  },
  excludedLibraries: [],
  libraryFilter: {
    groups: {
      "schema-first": {
        label: translate({ id: 'comparison.kanon.filter.schemaFirst.label', message: 'Schema-first' }),
        description: translate({ id: 'comparison.kanon.filter.schemaFirst.description', message: 'Developer-friendly schema definition libraries' }),
        libraries: ["@kanon/V3.0", "Zod", "Valibot", "Superstruct"],
      },
      compiled: {
        label: translate({ id: 'comparison.kanon.filter.compiled.label', message: 'Compiled / JIT' }),
        description: translate({ id: 'comparison.kanon.filter.compiled.description', message: 'Performance-focused libraries with code generation' }),
        libraries: ["@kanon/JIT", "AJV", "TypeBox", "Fast-Validator"],
      },
    },
  },
  tldrContent: (_data: BenchmarkReport) => {
    const highlight = translate({ id: 'comparison.kanon.tldr.highlight', message: 'Kanon is 2-3x faster' });
    const fullText = translate({ id: 'comparison.kanon.tldr', message: 'Kanon JIT dominates on discriminated unions and complex schemas. TypeBox/AJV win on simple validations. For typical API/form validation, Kanon is 2-3x faster than Zod/Valibot.' });
    // Split the full text around the highlight to apply formatting
    const highlightIndex = fullText.indexOf(highlight);
    if (highlightIndex === -1) {
      // Fallback: render full text with first sentence bold
      const firstDot = fullText.indexOf('.');
      return (
        <>
          <strong>{fullText.slice(0, firstDot + 1)}</strong>{" "}
          {fullText.slice(firstDot + 2)}
        </>
      );
    }
    const before = fullText.slice(0, highlightIndex);
    const after = fullText.slice(highlightIndex + highlight.length);
    // First sentence is bold
    const firstDot = before.indexOf('.');
    return (
      <>
        <strong>{before.slice(0, firstDot + 1)}</strong>{" "}
        {before.slice(firstDot + 2)}
        <span className={styles.highlight}>{highlight}</span>
        {after}
      </>
    );
  },
  generateCommand: "pnpm doc:generate:kanon:benchmarks-results",
  stickyHeaderOffset: 125,
};
