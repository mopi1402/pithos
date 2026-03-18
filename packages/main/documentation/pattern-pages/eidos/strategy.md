---
title: "Strategy Pattern in TypeScript"
sidebar_label: "Strategy"
description: "Learn how to implement the Strategy design pattern in TypeScript with functional programming. Replace complex if/else chains with interchangeable algorithms."
keywords:
  - strategy pattern typescript
  - design pattern functional
  - interchangeable algorithms
  - replace if else
  - runtime algorithm selection
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Strategy Pattern

Define a family of algorithms, encapsulate each one as a function, and swap them at runtime.

---

## The Problem

You're building an e-commerce checkout. Customers get different discounts: regular users pay full price, VIP members get 20% off, promo codes give 15% off.

The naive approach:

```typescript
function calculatePrice(price: number, customerType: string): number {
  if (customerType === "regular") return price;
  if (customerType === "vip") return price * 0.8;
  if (customerType === "promo") return price * 0.85;
  // ... grows with every new discount type
}
```

Every new discount = modify this function. It becomes a maintenance nightmare.

---

## The Solution

Each discount becomes a standalone function. Pick the right one by key at runtime:

```typescript
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";

const pricing = createStrategies({
  regular: (price: number) => price,
  vip: (price: number) => price * 0.8,
  promo: (price: number) => price * 0.85,
});

// TS infers: "regular" | "vip" | "promo" — typos are compile errors
pricing.execute("vip", 100); // 80
```

New discount? Add one line. No conditionals to update.

---

## Live Demo

<PatternDemo pattern="strategy" />

---

## Real-World Analogy

A GPS app with multiple routing options: fastest, shortest, no tolls, scenic. Each is a separate algorithm, but the navigation UI doesn't care which one is active — it just calls "calculate route" on the selected strategy.

---

## When to Use It

- Multiple algorithms for the same task, selected at runtime
- You want to add new variants without modifying existing code
- Complex conditional logic that picks between similar operations

---

## When NOT to Use It

If you only have two fixed variants, a ternary is simpler. Strategy pays off when algorithms grow over time.

---

## API

- [createStrategies](/api/eidos/strategy/createStrategies) — Build a strategy resolver from named functions
- [safeStrategy](/api/eidos/strategy/safeStrategy) — Wrap strategies to return `Result` instead of throwing
- [withFallback](/api/eidos/strategy/withFallback) — Chain a primary strategy with a backup
- [withValidation](/api/eidos/strategy/withValidation) — Validate input before execution
