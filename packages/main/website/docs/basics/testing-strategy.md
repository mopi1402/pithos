---
sidebar_label: "Testing Strategy"
sidebar_position: 5
title: "Testing Strategy"
description: "Explore Pithos's multi-layered testing strategy, including standard, edge-case, mutation, and property-based tests to ensure reliable TypeScript utilities."
keyword_stuffing_ignore:
  - test
---

import { Table } from "@site/src/components/shared/Table";
import { Picture } from "@site/src/components/shared/Picture";
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🛡️ Testing Strategy

100% code coverage is a starting point, not a finish line. A test suite can achieve full coverage while still missing critical bugs. Pithos uses a **multi-layered testing strategy** where each level catches bugs that the others miss.

--- 

## The Problem with Coverage Alone

Consider this function. It looks simple, but a single test can achieve 100% line coverage while completely missing a critical edge case:

```typescript
function divide(a: number, b: number): number {
  return a / b;
}
```

A single test achieves 100% coverage:

```typescript
it("divides two numbers", () => {
  expect(divide(10, 2)).toBe(5); // ✅ 100% coverage
});
```

But what happens with `divide(10, 0)`? The test passes, coverage is complete, yet the function silently returns `Infinity`. **Coverage tells you code executed, not that it works correctly.**

--- 

## The Four Levels

Each level of testing answers a different question:

<Table
  stickyHeader={false}
  columns={[
    {
      key: "level",
      header: "Level",
      sticky: true,
      width: "145px",
      minWidth: "145px",
      render: (item) => <strong>{item.level}</strong>
    },
    {
      key: "prefix",
      header: "Prefix",
    },
    {
      key: "question",
      header: "Question Answered"
    },
    {
      key: "catches",
      header: "What It Catches"
    }
  ]}
  data={[
    {
      level: "Standard",
      prefix: "(none)",
      question: '"Does each line execute?"',
      catches: "Dead code, forgotten branches"
    },
    {
      level: "Edge case",
      prefix: "`[🎯]`",
      question: '"Are all API contracts tested?"',
      catches: "Untested union types, undocumented behaviors"
    },
    {
      level: "Mutation",
      prefix: "`[👾]`",
      question: '"If someone changes this code, will a test fail?"',
      catches: "Weak assertions, silent regressions"
    },
    {
      level: "Property-based",
      prefix: "`[🎲]`",
      question: '"Does it work for _any_ valid input?"',
      catches: "Edge cases: `null`, `\"\"`, `NaN`, huge arrays"
    },
  ]}
  keyExtractor={(item) => item.level}
/>

### Why This Order Matters

1. **Standard tests** establish that your code runs
2. **Edge case tests** ensure your API promises are kept
3. **Mutation tests** verify your tests are actually checking something
4. **Property-based tests** explore the input space you didn't think of

---

## A Complete Example: `evolve`

The `evolve` function applies transformation functions to object properties. Here's how each testing level contributes:

```typescript
// evolve({ a: 5 }, { a: x => x * 2 }) → { a: 10 }
```

### Standard Tests - "Does it work?"

These tests verify the documented behavior:

```typescript
it("applies transformation functions to properties", () => {
  const result = evolve({ a: 5, b: 10 }, { a: (x: number) => x * 2 });
  expect(result).toEqual({ a: 10, b: 10 });
});

it("handles nested transformations", () => {
  const result = evolve(
    { nested: { value: 5 } },
    { nested: { value: (x: number) => x + 1 } }
  );
  expect(result).toEqual({ nested: { value: 6 } });
});

it("preserves properties without transformations", () => {
  const result = evolve({ a: 1, b: 2 }, {});
  expect(result).toEqual({ a: 1, b: 2 });
});
```

At this point, coverage might be 100%. But are the tests _solid_?

### Edge Case Tests - "Is the API contract complete?"

The `evolve` function accepts transformations as either:

- A **function** that transforms the whole value
- An **object** of nested transformations

Both branches must be tested explicitly:

```typescript
it("[🎯] applies function transformation to object value", () => {
  // Tests the "transformation is a function" branch for object values
  const result = evolve(
    { nested: { value: 5 } },
    { nested: (obj: { value: number }) => ({ value: obj.value * 2 }) }
  );
  expect(result).toEqual({ nested: { value: 10 } });
});
```

The `[🎯]` prefix signals: _"This test covers a specific API branch or documented behavior."_

### Mutation Tests - "Are my tests actually checking?"

[Stryker](https://stryker-mutator.io/) modifies your code and checks if tests fail. If they don't, you have a **surviving mutant**: a bug your tests would miss.

```typescript
// Stryker might change this:
if (transformation === undefined) { ... }
// To this:
if (transformation !== undefined) { ... }  // Mutant!
```

If no test fails, you need a targeted test:

```typescript
it("[👾] handles undefined transformation for nested object", () => {
  const result = evolve(
    { nested: { value: 5 }, other: 10 },
    { other: (x: number) => x * 2 }
  );
  // This specifically tests the branch where transformation is undefined
  expect(result).toEqual({ nested: { value: 5 }, other: 20 });
});
```

The `[👾]` prefix signals: _"This test exists to kill a specific mutant."_

### Property-Based Tests - "Does it work for _any_ input?"

Instead of testing specific values, test **invariants** that should hold for all inputs:

```typescript
import { it as itProp } from "@fast-check/vitest";
import { safeObject } from "_internal/test/arbitraries";

// Invariant: without transformations, object is preserved
itProp.prop([safeObject()])(
  "[🎲] preserves object when no transformations",
  (obj) => {
    expect(evolve(obj, {})).toEqual(obj);
  }
);

// Invariant: all keys are preserved
itProp.prop([safeObject()])("[🎲] preserves all keys", (obj) => {
  const result = evolve(obj, {});
  expect(Object.keys(result).sort()).toEqual(Object.keys(obj).sort());
});

// Independence: evolve returns a new object
itProp.prop([safeObject()])("[🎲] returns new object reference", (obj) => {
  const result = evolve(obj, {});
  if (Object.keys(obj).length > 0) {
    expect(result).not.toBe(obj);
  }
});
```

The `[🎲]` prefix signals: _"This test uses random inputs to verify an invariant."_

Property-based tests found bugs in Pithos that hundreds of manual tests missed, particularly around edge cases like empty objects, objects with `Symbol` keys, and deeply nested structures.

### The Result

Running the tests shows all levels working together:

<Picture src="/img/generated/evolve-tests-output" alt="Vitest output showing Pithos evolve function tests with unit, property, and mutation test prefixes" />

Each test has a clear purpose. No redundancy, no gaps.

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

---

<RelatedLinks>

- [Error Handling](../contribution/design-principles/error-handling.md) — How Pithos handles errors at the design level
- [Best Practices](./best-practices.md) — Validate at boundaries, trust the types

</RelatedLinks>
