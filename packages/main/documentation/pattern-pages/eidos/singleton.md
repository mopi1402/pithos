---
title: "Singleton Pattern in TypeScript"
sidebar_label: "Singleton"
description: "Learn how to implement the Singleton design pattern in TypeScript with functional programming. Lazy initialization with once()."
keywords:
  - singleton pattern typescript
  - single instance
  - lazy initialization
  - once function
  - module singleton
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Singleton Pattern

Ensure a value is created only once and provide a shared point of access to it.

---

## The Problem

You have expensive resources (database connections, cache clients, loggers) that should be initialized once and reused everywhere. The naive approach: initialize at import time and hope for the best.

```typescript
// db.ts
export const db = new DatabaseConnection(); // runs immediately at import
// What if the connection fails? What if nobody needs it yet?
```

Or worse, initialize in every function that needs it:

```typescript
function getUser(id: string) {
  const db = new DatabaseConnection(); // new connection every call!
  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);
}
```

One wastes resources on startup. The other wastes resources on every call.

---

## The Solution

Lazy initialization with `once`. The instance is created on first use, then reused:

```typescript
import { once } from "@pithos/core/arkhe";

const getDatabase = once(() => {
  console.log("Connecting...");
  return new DatabaseConnection();
});

// First call: initializes (slow)
const db1 = getDatabase(); // "Connecting..."

// Second call: same instance (instant)
const db2 = getDatabase(); // no log
db1 === db2; // true
```

No class, no `getInstance()`, no private constructor. `once` wraps any function and guarantees it runs exactly once. The result is cached and returned on every subsequent call.

---

## Live Demo

Three services: Database, Cache, Logger. Click Request on each. First click is slow (initialization). Click again: instant, same instance. Watch the counters: instances stay low while requests climb.

<PatternDemo pattern="singleton" />

---

## Real-World Analogy

A government. A country has one president at a time. You don't create a new president every time you need a decision — you access the existing one. `once` is the election: it runs once, and everyone gets the same leader.

---

## Modules Are Already Singletons

ES modules are evaluated once. Every import gets the same reference:

```typescript
// config.ts
export const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000,
};

// Same object everywhere
import { config } from "./config"; // same instance
import { config } from "./config"; // same instance
```

For static values, no pattern needed. `once` adds value when you need lazy initialization or async setup.

---

## When You Need Testability

Singletons become problematic when they hide dependencies. The fix: pass them explicitly.

```typescript
// Hidden dependency, hard to test
function getUser(id: string) {
  return database.query(`SELECT * FROM users WHERE id = ?`, [id]);
}

// Explicit dependency, easy to test
function getUser(db: Database, id: string) {
  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);
}

const mockDb = { query: vi.fn() };
getUser(mockDb, "123");
```

This isn't "singleton vs DI": you can have both. A singleton provides the instance, DI passes it where it's needed. Angular uses constructor injection. React uses context. Zustand and Pinia are simply imported. The principle is the same.

---

## When to Use It

A global logger, a read-only config loaded once at startup, a database pool, or hardware access where there's literally one resource. The pattern works well when the instance is stateless or read-only.

---

## When NOT to Use It

If the resource is cheap to create or you need multiple instances for testing, skip the singleton. Overusing it leads to hidden global state that's hard to reason about.

:::info Singleton, an anti-pattern?
The "singleton is an anti-pattern" argument comes from OOP, where the classic implementation causes real problems:

1. **Private constructor** prevents subclassing and testing
2. **Static getInstance()** creates a hidden global dependency
3. **Mutable state exposed via static method** with no access control
4. **Tight coupling** to the concrete class, not an interface

In functional TypeScript, none of these apply. There's no class, no private constructor, no static method. `once` is just a function that caches its result. The instance can be passed via DI for testability. ES modules already guarantee single evaluation. The problems that made Singleton an anti-pattern in Java or C# simply don't exist here.

ES modules, Angular services, NestJS providers, React contexts, Vue's provide/inject, Redux, Zustand, Pinia: they all rely on singleton semantics. The pattern isn't bad. The OOP implementation was.
:::

---

## API

- [once](/api/arkhe/function/once) Lazy initialization, returns same value on subsequent calls
