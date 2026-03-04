---
sidebar_label: "Testing Guide"
sidebar_position: 3
title: "Testing Guide"
description: "Practical guide for testing Pithos utilities: when to use each test level, tools, commands, and coverage goals."
keyword_stuffing_ignore:
  - test
---

import { Table } from "@site/src/components/shared/Table";

# 🧪 Testing Guide

This guide details how to test a Pithos utility: when to use each level, available tools, commands, and coverage goals.

To understand the multi-layered testing strategy and why it exists, see the [Testing Strategy](../basics/testing-strategy.md) page.

---

## When to Use Each Level

<Table
  stickyHeader={false}
  columns={[
    {
      key: "situation",
      header: "Situation",
      sticky: true,
      width: "200px",
      minWidth: "200px",
    },
    {
      key: "approach",
      header: "Recommended Approach",
    },
  ]}
  data={[
    {
      situation: "New function",
      approach: "Start with standard tests, add property-based for invariants",
    },
    {
      situation: "Union types in API",
      approach: "Add `[🎯]` tests for each branch",
    },
    {
      situation: "Mutation score < 100%",
      approach: "Add targeted `[👾]` tests for surviving mutants",
    },
    {
      situation: "Complex input domain",
      approach: "Add `[🎲]` tests with appropriate arbitraries",
    },
    {
      situation: "Bug report",
      approach: "Write a failing test first, then fix",
    },
  ]}
  keyExtractor={(item) => item.situation}
  allowWrapOnMobile={true}
/>

---

## Tools

<Table
  stickyHeader={false}
  columns={[
    {
      key: "tool",
      header: "Tool",
      sticky: true,
      width: "25%",
      minWidth: "120px",
      maxWidth: "150px",
    },
    {
      key: "purpose",
      header: "Purpose",
    },
    {
      key: "documentation",
      header: "Documentation",
    },
  ]}
  data={[
    {
      tool: "[Vitest](https://vitest.dev/)",
      purpose: "Test runner with TypeScript support",
      documentation: "[Guide](https://vitest.dev/guide/)",
    },
    {
      tool: "[Stryker](https://stryker-mutator.io/)",
      purpose: "Mutation testing",
      documentation: "[Docs](https://stryker-mutator.io/docs/)",
    },
    {
      tool: "[fast-check](https://fast-check.dev/)",
      purpose: "Property-based testing",
      documentation: "[Tutorials](https://fast-check.dev/docs/tutorials/)",
    },
  ]}
  keyExtractor={(item) => item.tool}
/>

---

## Running Tests

Pithos provides several test commands depending on what you want to verify, from a quick full run to targeted mutation testing on a single file:

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm coverage

# Run mutation tests (entire project)
pnpm test:mutation

# Run mutation tests on a specific file
pnpm stryker run --mutate 'packages/pithos/src/arkhe/object/evolve.ts'
```

---

## Coverage Goals

<Table
  columns={[
    {
      key: "metric",
      header: "Metric",
      sticky: true,
      width: "30%",
      minWidth: "150px",
      maxWidth: "150px",
      wrap: true,
    },
    {
      key: "target",
      header: "Target",
    },
    {
      key: "why",
      header: "Why",
    },
  ]}
  data={[
    {
      metric: "Code coverage",
      target: "100%",
      why: "Baseline: ensures all code executes",
    },
    {
      metric: "Mutation score",
      target: "100%",
      why: "Ensures tests actually verify behavior",
    },
    {
      metric: "Property-based tests",
      target: "1-5 per function",
      why: "Explores edge cases automatically",
    },
    {
      metric: "Edge case coverage",
      target: "All union types + `@note`",
      why: "Ensures API contracts are tested",
    },
  ]}
  keyExtractor={(item) => item.metric}
/>

---

## The Philosophy

> _"A test that passes when the code is wrong is worse than no test at all: it gives false confidence."_

Each prefix tells a story:

- **No prefix**: "This is expected behavior"
- **`[🎯]`**: "This covers a specific API branch"
- **`[👾]`**: "This kills a specific mutant"
- **`[🎲]`**: "This verifies an invariant holds for any input"

When you see a failing test, the prefix immediately tells you _why_ that test exists and what kind of bug you're dealing with.
