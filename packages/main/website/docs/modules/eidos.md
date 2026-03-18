---
sidebar_position: 4
sidebar_label: "Eidos"
title: "Eidos - GoF Design Patterns in Functional TypeScript"
description: "All 23 Gang of Four design patterns reimagined for functional TypeScript. No classes, no inheritance, just functions, types, and composition."
keywords:
  - design patterns typescript
  - functional design patterns
  - gof patterns functional
  - typescript patterns
  - no classes
image: /img/social/eidos-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Eidos"
  description="All 23 Gang of Four design patterns reimagined for functional TypeScript. No classes, no inheritance, just functions, types, and composition."
  url="https://pithos.dev/guide/modules/eidos"
/>

# 🅴 <ModuleName name="Eidos" />

_εἶδος - "form, pattern"_

All 23 Gang of Four design patterns, reimagined for functional TypeScript. No classes, no inheritance, just functions, discriminated unions, and composition.

:::info
Eidos translates classic OOP patterns into idiomatic functional code. Some patterns become simple functions. Others become type aliases. Some are marked deprecated because TypeScript's type system makes them unnecessary. Each module documents the OOP version, explains the functional equivalent, and provides working functional code.
:::

---

## Philosophy

The GoF patterns were designed for languages without first-class functions, without algebraic types, and without powerful type inference. In functional TypeScript:

- **Strategy** is just a `Record<string, Function>`
- **Visitor** is just a `switch` on a discriminated union
- **Factory Method** is just dependency injection
- **Decorator** is just function composition

Eidos doesn't force OOP patterns into functional code. It shows the idiomatic way to solve the same problems. When a pattern is absorbed by the language, we document it with a `@deprecated` function that explains what to do instead, directly accessible from your IDE.

---

## Pattern Categories

### Patterns with Real Value

These patterns provide utility functions you can use in your code:

| Pattern | Functions | Description |
|---------|-----------|-------------|
| **Strategy** | `createStrategies`, `safeStrategy`, `withFallback`, `withValidation` | Interchangeable algorithms with typed lookup |
| **Observer** | `createObservable` | Pub/sub with typed events |
| **Decorator** | `decorate`, `before`, `after`, `around` | Function wrapping and composition |
| **Adapter** | `adapt`, `createAdapter` | Function signature transformation |
| **Command** | `undoable`, `createCommandStack`, `undoableState`, `createReactiveCommandStack` | Undo/redo with action history |
| **Chain of Responsibility** | `createChain`, `safeChain` | Sequential handler pipelines |
| **State** | `createMachine` | Finite state machines |
| **Iterator** | `createIterable`, `lazyRange`, `iterate` | Lazy sequences with operators |
| **Composite** | `leaf`, `branch`, `fold`, `map`, `flatten`, `find` | Tree structures with traversal |
| **Abstract Factory** | `createAbstractFactory` | Factory families with typed lookup |
| **Mediator** | `createMediator` | Typed event hub for decoupled communication |
| **Memento** | `createHistory` | State snapshots with undo/redo |
| **Builder** | `createBuilder`, `createValidatedBuilder` | Immutable fluent builders |
| **Template Method** | `templateWithDefaults` | Algorithm skeletons with overridable steps |

### Patterns Covered by Arkhe

These patterns are already implemented in Arkhe. Eidos re-exports them for discoverability:

| Pattern | Arkhe Functions | Description |
|---------|-----------------|-------------|
| **Proxy** | `memoize`, `once`, `throttle`, `debounce`, `lazy`, `guarded` | Function interception and caching |
| **Prototype** | `deepClone`, `deepCloneFull` | Object cloning |
| **Singleton** | `once` (alias `singleton`) | Single instance creation |
| **Flyweight** | `memoize` | Object pooling via cache |

### Patterns Absorbed by the Language

These patterns are unnecessary in functional TypeScript. The functions exist only for documentation and are marked `@deprecated` to guide toward idiomatic code:

| Pattern | Why Absorbed |
|---------|--------------|
| **Bridge** | A bridge is just `(impl) => abstraction`, a function |
| **Factory Method** | Pass the factory as a parameter (dependency injection) |
| **Facade** | A facade is just a function that calls other functions |
| **Visitor** | Use `switch` on a discriminated union |
| **Interpreter** | Discriminated unions + recursive evaluation |

---

## Quick Examples

### Strategy: Interchangeable Algorithms

```typescript
import { createStrategies } from "@pithos/core/eidos/strategy/strategy";

const pricing = createStrategies({
  regular: (price: number) => price,
  vip: (price: number) => price * 0.8,
  premium: (price: number) => price * 0.7,
});

pricing.execute("vip", 100); // 80
```

### State: Finite State Machine

```typescript
import { createMachine } from "@pithos/core/eidos/state/state";

const light = createMachine({
  green:  { timer: "yellow" },
  yellow: { timer: "red" },
  red:    { timer: "green" },
}, "green");

light.send("timer"); // "yellow"
light.send("timer"); // "red"
```

### Composite: Tree Structures

```typescript
import { leaf, branch, fold } from "@pithos/core/eidos/composite/composite";

const tree = branch({ name: "root", size: 0 }, [
  leaf({ name: "file1.txt", size: 100 }),
  branch({ name: "docs", size: 0 }, [
    leaf({ name: "readme.md", size: 50 }),
  ]),
]);

const totalSize = fold(tree, {
  leaf: (data) => data.size,
  branch: (_, children) => children.reduce((a, b) => a + b, 0),
}); // 150
```

### Mediator: Decoupled Communication

```typescript
import { createMediator } from "@pithos/core/eidos/mediator/mediator";

type Events = {
  userLoggedIn: { userId: string };
  orderPlaced: { orderId: string };
};

const mediator = createMediator<Events>();

mediator.on("userLoggedIn", ({ userId }) => {
  console.log(`Welcome ${userId}`);
});

mediator.emit("userLoggedIn", { userId: "alice" });
```

### Builder: Fluent Construction

```typescript
import { createBuilder } from "@pithos/core/eidos/builder/builder";

const queryBuilder = createBuilder({ table: "", where: [] as string[], limit: 100 })
  .step("from", (s, table: string) => ({ ...s, table }))
  .step("where", (s, clause: string) => ({ ...s, where: [...s.where, clause] }))
  .step("limit", (s, n: number) => ({ ...s, limit: n }))
  .done();

const query = queryBuilder()
  .from("users")
  .where("active = true")
  .limit(10)
  .build();
```

---

## Memento vs Command for Undo/Redo

Both patterns support undo/redo, but work differently:

| Approach | Module | How it works | When to use |
|----------|--------|--------------|-------------|
| **State snapshots** | Memento (`createHistory`) | Stores copies of state, restores on undo | State is cheap to copy |
| **Action history** | Command (`createCommandStack`) | Stores execute/undo pairs | You have reversible operations |

```typescript
// Memento: store states
const history = createHistory({ count: 0 });
history.push({ count: 1 });
history.undo(); // restores { count: 0 }

// Command: store actions
const stack = createCommandStack();
stack.execute(undoable(() => count++, () => count--));
stack.undo(); // calls the undo function
```

---

## ✅ When to Use

Eidos is useful when:

- You come from OOP and want to understand the functional equivalents
- You need a specific pattern (state machine, builder, observer, etc.)
- You want typed, tested implementations rather than writing them yourself

---

## ❌ When NOT to Use

| Need | Use Instead |
|------|-------------|
| Data transformation | [Arkhe](/guide/modules/arkhe/) |
| Error handling | [Zygos](/guide/modules/zygos/) |
| Schema validation | [Kanon](/guide/modules/kanon/) |

---

<RelatedLinks title="Related Resources">

- [Eidos API Reference](/api/eidos) - Full API documentation for all patterns
- [Arkhe Utilities](/guide/modules/arkhe/) - General utilities that complement Eidos

</RelatedLinks>
