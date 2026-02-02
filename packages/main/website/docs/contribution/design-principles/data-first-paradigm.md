---
sidebar_position: 6
title: Data-First vs Data-Last Paradigm
---

# Data-First vs Data-Last Paradigm

## The Two Approaches

```typescript
// Data-First (Radash, es-toolkit, Pithos standard)
map(users, (user) => user.name);
filter(numbers, (n) => n > 0);

// Data-Last (Ramda, fp-ts, Remeda pipe)
map((user) => user.name)(users);
filter((n) => n > 0)(numbers);
```

## Pithos Choice: **Data-First by default**

(Except for `Zygos` which uses chained methods)

### Why Data-First?

1. **Superior TypeScript Inference**: TypeScript easily deduces the iterator type (`user` or `n`) because the data (`users`, `numbers`) is provided _before_. With Data-Last, inference is often broken or requires explicit generics.
2. **JavaScript Standard**: All native methods (`Array.map`, `Array.filter`) and modern ones (`Promise.then`) put data in the main context.
3. **Direct Readability**: `verb(subject, params)` reads like a sentence ("Map users to names").

| Paradigm           | Example                                 | TS Inference           | Pithos Usage          |
| ------------------ | --------------------------------------- | ---------------------- | --------------------- |
| **Data-First**     | `map(items, fn)`                        | ✅ Excellent (Natural) | **Standard (Arkhe)**  |
| **Data-Last**      | `map(fn)(items)`                        | ⚠️ Often complex       | Not used              |
| **Piping**         | `items.map(fn)`                         | ✅ Excellent           | **Zygos (Fluid API)** |
| **Autocompletion** | IDE suggests available methods          |
| **Familiarity**    | Close to native methods (`array.map()`) |

## But with Piping Support

For functional composition, Pithos also supports the pipe pattern:

```typescript
import { pipe } from "pithos/arkhe/function/pipe";
import { map, filter, take } from "pithos/arkhe/array";

// Elegant composition
const result = pipe(
  users,
  (users) => filter(users, (u) => u.active),
  (users) => map(users, (u) => u.name),
  (names) => take(names, 5)
);
```

:::info Design Decision

Pithos is **data-first only**. Unlike Remeda's dual-mode approach, we deliberately chose not to support data-last variants. This keeps the API simple, predictable, and ensures optimal TypeScript inference.

For composition, use [`pipe()`](/api/arkhe/function/pipe) with explicit data-first calls — it's slightly more verbose but crystal clear.

:::
