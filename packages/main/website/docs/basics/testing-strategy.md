---
sidebar_label: "Testing Strategy"
sidebar_position: 5
title: "Testing Strategy"
description: "Explore Pithos's multi-layered testing strategy, including standard, edge-case, mutation, and property-based tests to ensure reliable TypeScript utilities."
keyword_stuffing_ignore:
  - test
---

import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { Picture } from "@site/src/components/shared/Picture";
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🛡️ Testing Strategy

100% code coverage is a good starting point, but the road to the finish line is still long: it simply guarantees every line ran at least once, not that the code is free of bugs. Pithos uses a **multi-layered testing strategy** where each level catches bugs that the others miss.

--- 

## The Problem with Coverage Alone

Consider this simple function that divides two numbers and returns the result:

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

This gives an impression of confidence and robustness since 100% of the code has been tested. But are all edge cases properly covered?

```typescript
divide(10, 0); // → Infinity
```

The test passes, coverage is complete, yet the function silently returns `Infinity`. **Coverage tells you code executed, not that it works correctly.**

--- 

## The Four Levels

Each level of testing answers a different question:

<TableConfig noEllipsis wrapAll>

| !Level | Prefix | Question Answered | What It Catches |
| --- | --- | --- | --- |
| **Standard** | (none) | "Does each line execute?" | Dead code, forgotten branches |
| **Edge case** | `[🎯]` | "Are all API contracts tested?" | Untested union types, undocumented behaviors |
| **Mutation** | `[👾]` | "If someone changes this code, will a test fail?" | Weak assertions, silent regressions |
| **Property-based** | `[🎲]` | "Does it work for _any_ valid input?" | Edge cases: `null`, `""`, `NaN`, huge arrays |

</TableConfig>

:::note
The order isn't critical, but it helps flush out bugs from the most obvious to the most sneaky.
:::

---

## And in Pithos?

Pithos applies this strategy to every utility it ships, with the goal of flushing out even the most unlikely bugs.

<details>
<summary>Detailed example with <a href="/api/arkhe/object/evolve"><code>evolve</code></a></summary>

The [`evolve`](/api/arkhe/object/evolve) function applies transformation functions to object properties. For example, `evolve({ a: 5 }, { a: x => x * 2 })` returns `{ a: 10 }`. Here's how each testing level contributes:

### Standard Tests

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

### Edge Case Tests

The `evolve` function accepts transformations as either:

- A **function** that transforms the whole value
- An **object** of nested transformations

Both branches must be tested explicitly:

```typescript
it("[🎯] applies function transformation to object value", () => {
  const result = evolve(
    { nested: { value: 5 } },
    { nested: (obj: { value: number }) => ({ value: obj.value * 2 }) }
  );
  expect(result).toEqual({ nested: { value: 10 } });
});
```

### Mutation Tests

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
  expect(result).toEqual({ nested: { value: 5 }, other: 20 });
});
```

### Property-Based Tests

Instead of testing specific values, test **invariants** that should hold for all inputs:

```typescript
import { it as itProp } from "@fast-check/vitest";
import { safeObject } from "_internal/test/arbitraries";

itProp.prop([safeObject()])(
  "[🎲] preserves object when no transformations",
  (obj) => {
    expect(evolve(obj, {})).toEqual(obj);
  }
);

itProp.prop([safeObject()])("[🎲] preserves all keys", (obj) => {
  const result = evolve(obj, {});
  expect(Object.keys(result).sort()).toEqual(Object.keys(obj).sort());
});

itProp.prop([safeObject()])("[🎲] returns new object reference", (obj) => {
  const result = evolve(obj, {});
  if (Object.keys(obj).length > 0) {
    expect(result).not.toBe(obj);
  }
});
```

</details>

### The Result

Running the tests shows all levels working together:

<Picture src="/img/generated/evolve-tests-output" alt="Vitest output showing Pithos evolve function tests with unit, property, and mutation test prefixes" widths={[400, 800, 1200, 1600]} sizes="100vw" />
<br />
Each test has a clear purpose. No redundancy, no gaps.

This strategy minimizes risks, but no test suite guarantees zero bugs. If you encounter unexpected behavior, [open an issue](https://github.com/mopi1402/pithos/issues) — every report helps us strengthen the library.

---

:::tip[Contributing to Pithos?]
Check out the [Testing Guide](../contribution/testing-guide.md) for when to use each level, tools, commands, and coverage goals.
:::

---

<RelatedLinks>

- [Testing Guide](../contribution/testing-guide.md) — How to test a Pithos utility in practice
- [Error Handling](../contribution/design-principles/error-handling.md) — How Pithos handles errors at the design level
- [Best Practices](./best-practices.md) — Validate at boundaries, trust the types

</RelatedLinks>
