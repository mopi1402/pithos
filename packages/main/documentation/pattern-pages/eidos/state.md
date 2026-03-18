---
title: "State Pattern in TypeScript"
sidebar_label: "State"
description: "Learn how to implement the State design pattern in TypeScript with functional programming. Build finite state machines with typed transitions."
keywords:
  - state pattern typescript
  - finite state machine
  - state machine typescript
  - typed transitions
  - tennis scoring
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# State Pattern

Allow an object to alter its behavior when its internal state changes, as if it switched to a different implementation.

---

## The Problem

You're building a tennis scoring system for Roland Garros. Tennis scoring is notoriously complex: 0 → 15 → 30 → 40 → Game, but at 40-40 it's Deuce, then Advantage, then either Game or back to Deuce.

The naive approach:

```typescript
function scorePoint(server: Score, receiver: Score, whoScored: "server" | "receiver") {
  if (whoScored === "server") {
    if (server === "40" && receiver === "40") {
      return { server: "AD", receiver: "40" };
    } else if (server === "40" && receiver !== "AD") {
      return { server: "Game", receiver };
    } else if (server === "AD") {
      return { server: "Game", receiver: "40" };
    } else if (receiver === "AD") {
      return { server: "40", receiver: "40" }; // back to Deuce
    } else if (server === "0") {
      return { server: "15", receiver };
    } else if (server === "15") {
      return { server: "30", receiver };
    }
    // ... 15 more branches for all combinations
  }
  // ... duplicate everything for receiver
}
```

Nested conditionals everywhere. Easy to miss edge cases. No guarantee you've covered all states.

---

## The Solution

Model each score combination as a state with explicit transitions:

```typescript
import { createMachine } from "@pithos/core/eidos/state/state";

// TS infers all states and events — invalid transitions are compile errors
const tennisGame = createMachine({
  "0-0":   { p1: { to: "15-0" },  p2: { to: "0-15" } },
  "15-0":  { p1: { to: "30-0" },  p2: { to: "15-15" } },
  "0-15":  { p1: { to: "15-15" }, p2: { to: "0-30" } },
  "30-0":  { p1: { to: "40-0" },  p2: { to: "30-15" } },
  // ... all score combinations
  "40-40": { p1: { to: "AD-40" }, p2: { to: "40-AD" } },  // Deuce!
  "AD-40": { p1: { to: "Game-P1" }, p2: { to: "40-40" } }, // Advantage or back to Deuce
  "40-AD": { p1: { to: "40-40" }, p2: { to: "Game-P2" } },
  // Simplified — live demo uses "Deuce", "AD-P1", "AD-P2" for readability
  "Game-P1": {},  // Terminal state
  "Game-P2": {},
}, "0-0");

tennisGame.send("p1"); // "15-0"
tennisGame.send("p1"); // "30-0"
// ... play continues
```

Every state transition is explicit. The Deuce ↔ Advantage loop is clear. Terminal states have no transitions.

---

## Live Demo

Score points for each player and watch the state machine handle Deuce, Advantage, and Game transitions.

<PatternDemo pattern="state" />

---

## Real-World Analogy

A tennis umpire's scoreboard. The umpire doesn't think "if player 1 has 40 and player 2 has 30, then...". They just know: from this score, a point for player 1 leads to that score. The rules are encoded in the transitions, not in conditional logic.

---

## When to Use It

- Object behavior depends on its state
- You have complex conditional logic based on state
- State transitions should be explicit and validated
- Building workflows, game logic, or multi-step processes

---

## When NOT to Use It

If your state is just a boolean flag (on/off, enabled/disabled), a state machine adds unnecessary ceremony. Use it when you have 3+ states with non-trivial transition rules.

---

## API

- [createMachine](/api/eidos/state/createMachine) — Create a finite state machine with typed states and events
