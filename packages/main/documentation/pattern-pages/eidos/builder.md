---
title: "Builder Pattern in TypeScript"
sidebar_label: "Builder"
description: "Learn how to implement the Builder design pattern in TypeScript with functional programming. Construct complex objects step by step with a fluent API."
keywords:
  - builder pattern typescript
  - fluent api
  - step by step construction
  - immutable builder
  - chart builder
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Builder Pattern

Construct complex objects step by step. The same construction process can create different representations.

---

## The Problem

You're building a chart library. Charts have many optional parameters: type, title, labels, multiple datasets, legend, axis labels, grid lines.

The naive approach:

```typescript
function createChart(
  type: string,
  title?: string,
  labels?: string[],
  data?: number[],
  data2?: number[],
  color?: string,
  color2?: string,
  showLegend?: boolean,
  yAxisLabel?: string
) {
  // 9+ parameters, most optional, order matters
}

// Calling is awkward
createChart("bar", "Revenue", months, revenue, expenses, "#3b82f6", "#ef4444", true);
```

Too many parameters. Adding a second dataset requires passing all previous ones. Easy to mess up order.

---

## The Solution

Build the chart step by step with a fluent API:

```typescript
import { createBuilder } from "@pithos/core/eidos/builder/builder";

// TS infers all step names — typos are compile errors
const chartBuilder = createBuilder({
  type: "bar",
  title: "",
  labels: [],
  datasets: [],
})
  .step("type", (s, type: "bar" | "line") => ({ ...s, type }))
  .step("title", (s, title: string) => ({ ...s, title }))
  .step("labels", (s, labels: string[]) => ({ ...s, labels }))
  .step("data", (s, data: number[], color: string, label: string) => ({
    ...s,
    datasets: [{ label, data, color }],
  }))
  // Key builder feature: composing with previous state
  .step("addDataset", (s, label: string, data: number[], color: string) => ({
    ...s,
    datasets: [...s.datasets, { label, data, color }],
  }))
  .step("legend", (s, show: boolean) => ({ ...s, showLegend: show }))
  .done();

// Fluent, readable, composable
const chart = chartBuilder()
  .type("bar")
  .title("Monthly Revenue")
  .labels(["Jan", "Feb", "Mar", "Apr", "May", "Jun"])
  .data([120, 340, 220, 510, 480, 390], "#3b82f6", "Revenue")
  .addDataset("Expenses", [80, 150, 120, 200, 180, 160], "#ef4444")
  .legend(true)
  .build();
```

Each step is named. Order is flexible. `.addDataset()` composes with previous data — a simple options object couldn't do this.

---

## Live Demo

Toggle each builder step and watch the chart update in real-time. Notice how `.addDataset()` stacks on top of the first dataset — that's the builder composing state internally.

<PatternDemo pattern="builder" />

---

## Real-World Analogy

Ordering a custom pizza. You start with dough, add sauce, choose cheese, pick toppings. Each step is independent. You can add toppings in any order. The final `.build()` is putting it in the oven.

---

## When to Use It

- Objects have many optional parameters
- Construction involves multiple steps that compose
- You want a fluent, readable API
- Same process should create different configurations

---

## When NOT to Use It

If your object can be fully described by a single options object with no composable steps, prefer that. Builder adds ceremony that's only worth it when steps compose or when construction is genuinely sequential.

---

## API

- [createBuilder](/api/eidos/builder/createBuilder) — Create an immutable fluent builder
- [createValidatedBuilder](/api/eidos/builder/createValidatedBuilder) — Builder with validation on each step
