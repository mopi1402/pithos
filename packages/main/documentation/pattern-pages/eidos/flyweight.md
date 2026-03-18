---
title: "Flyweight Pattern in TypeScript"
sidebar_label: "Flyweight"
description: "Learn how to implement the Flyweight design pattern in TypeScript with functional programming. Share common data to reduce memory usage."
keywords:
  - flyweight pattern typescript
  - memory optimization
  - object pooling
  - shared state
  - memoization
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Flyweight Pattern

Share common state across many similar objects to minimize memory usage.

---

## The Problem

You're building a text editor. Each character could be an object with font, size, color, and position. A million characters = a million objects = memory explosion.

The naive approach:

```typescript
class Character {
  constructor(
    public char: string,
    public font: string,      // "Arial" repeated millions of times
    public size: number,      // 12 repeated millions of times
    public color: string,     // "#000000" repeated millions of times
    public x: number,
    public y: number
  ) {}
}

// Million characters = million copies of "Arial", 12, "#000000"
```

Intrinsic state (font, size, color) is duplicated. Massive memory waste.

---

## The Solution

Share intrinsic state. Store only extrinsic state (position) per instance:

```typescript
import { memoize } from "@pithos/core/arkhe";

// Flyweight factory - returns shared style objects
const getStyle = memoize((font: string, size: number, color: string) => ({
  font,
  size,
  color,
}));

// Characters only store position + reference to shared style
interface Character {
  char: string;
  style: ReturnType<typeof getStyle>;  // shared!
  x: number;
  y: number;
}

// Million characters, but only a few unique styles
const char1: Character = {
  char: "H",
  style: getStyle("Arial", 12, "#000000"),  // shared
  x: 0,
  y: 0,
};

const char2: Character = {
  char: "i",
  style: getStyle("Arial", 12, "#000000"),  // same reference — not a copy
  x: 10,
  y: 0,
};

char1.style === char2.style; // true — same object in memory
```

Styles are shared via memoization. Memory usage drops dramatically.

---

## Live Demo

Type text, change styles with the presets, and watch the counters. Toggle Flyweight on and off - the memory bar shows the difference in real time.

<PatternDemo pattern="flyweight" />

---

## Real-World Analogy

A font file. Your computer doesn't store a separate "A" image for every "A" on screen. It stores one "A" glyph and reuses it everywhere, just changing position and size.

---

## When to Use It

If you're creating thousands of objects that share most of their data (game entities, DOM nodes, text characters, map tiles), extract the shared part into a memoized factory. The more duplicates, the bigger the win.

---

## When NOT to Use It

If each object is unique with no shared state, there's nothing to pool. Flyweight adds a lookup cost that only pays off when many objects share the same intrinsic data.

---

## In Functional TypeScript

Flyweight is essentially memoization. `memoize` from Arkhe handles the pooling:

```typescript
import { memoize } from "@pithos/core/arkhe";

// Any function that creates objects can become a flyweight factory
const getColor = memoize((r: number, g: number, b: number) => ({ r, g, b }));

// Same arguments = same object
getColor(255, 0, 0) === getColor(255, 0, 0); // true
```

---

## API

- [memoize](/api/arkhe/function/memoize) — Cache function results, effectively creating an object pool

