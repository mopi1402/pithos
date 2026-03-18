---
title: "Memento Pattern in TypeScript"
sidebar_label: "Memento"
description: "Learn how to implement the Memento design pattern in TypeScript with functional programming. Capture and restore object state for undo/redo."
keywords:
  - memento pattern typescript
  - state snapshot
  - undo redo state
  - history management
  - state restoration
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Memento Pattern

Capture an object's state as a snapshot so it can be restored later without exposing internals.

---

## The Problem

You're building a photo editor. Users apply filters: brightness, contrast, saturation, blur, sepia. They want to undo, but not step by step: they want to click any previous state and jump back to it instantly.

The naive approach:

```typescript
let filterHistory: FilterState[] = [];
let currentIndex = 0;

function applyFilter(filter: string, value: number) {
  canvas.apply(filter, value);
  // Manual snapshot management everywhere
  filterHistory = filterHistory.slice(0, currentIndex + 1);
  filterHistory.push(captureState(canvas));
  currentIndex++;
}

function jumpTo(index: number) {
  currentIndex = index;
  canvas.restore(filterHistory[index]); // hope the index is valid
}
```

History logic tangled with filter logic. No thumbnails, no metadata, no safety.

---

## The Solution

Separate history management from business logic. Each state change creates a snapshot automatically:

```typescript
import { createHistory } from "@pithos/core/eidos/memento/memento";

interface PhotoState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  thumbnail: string; // base64 preview
}

const history = createHistory<PhotoState>({
  brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0,
  thumbnail: captureThumb(canvas),
});

function applyFilter(filter: keyof PhotoState, value: number) {
  const current = history.current();
  const next = { ...current, [filter]: value, thumbnail: captureThumb(canvas) };
  history.push(next);
}

// Jump to any snapshot directly
const snapshots = history.history(); // all snapshots with timestamps
// Click snapshot #3 → undo until we reach it
```

History is automatic. Each snapshot includes a thumbnail for visual navigation. Unlike Command (which stores named operations like "increase brightness +10"), Memento stores the full visual state: what you see is what you restore.

---

## Live Demo

A photo editor where you apply filters (brightness, contrast, saturation, blur, sepia). Each change creates a snapshot with a thumbnail. The History panel lets you jump to any state directly, not step by step. Unlike Command (named operations), Memento captures visual snapshots of the entire state.

<PatternDemo pattern="memento" />

---

## Real-World Analogy

A save point in a video game. The game captures your exact state: position, inventory, health, progress. Later, you can restore to that exact moment. The save file is the memento.

---

## When to Use It

- Implement undo/redo with visual state snapshots
- Create save points or checkpoints
- State is cheap to copy (small objects, immutable data)
- Users need to jump to any previous state, not just step back

:::tip Memento vs Command
Both support undo/redo. **Memento** stores state snapshots: good when state is small and you want visual history. **Command** stores actions with inverse operations: good when state is large but operations are reversible. The photo editor uses Memento because you want to see thumbnails of each state, not a list of "brightness +10" operations.
:::

---

## When NOT to Use It

If your state is large (a full document, a complex 3D scene), storing snapshots at every change is expensive. Use Command instead, which only stores the delta.

---

## API

- [createHistory](/api/eidos/memento/createHistory) — Create a state history with undo/redo support
