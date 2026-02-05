---
sidebar_position: 3
title: Zygos
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';

# 🆉 <ModuleName name="Zygos" />  

_ζυγός - "balance"_

Functional error handling. Lightweight alternatives to Neverthrow and fp-ts (Either, Task, TaskEither).

---

## Quick Example

```typescript
import { ok, err, Result } from "pithos/zygos/result/result";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

const result = divide(10, 2);

if (result.isOk()) {
  console.log(result.value); // 5
} else {
  console.log(result.error); // Never reached
}
```

---

## Available Monads

| Monad | Description | Use Case |
|-------|-------------|----------|
| **Result** | `Ok<T>` or `Err<E>` | Operations that can fail |
| **Option** | `Some<A>` or `None` | Optional values (no null) |
| **Either** | `Left<E>` or `Right<A>` | Generic two-case branching |
| **Task** | Lazy async computation | Deferred async operations |
| **TaskEither** | Async Either | Async operations that can fail |

--- 

## Result

8x smaller than Neverthrow (~0.79KB vs ~6.62KB), **100% API compatible**.

### Drop-in Replacement for Neverthrow

**Migrate from Neverthrow with a single line change:**

```typescript
// Before (Neverthrow)
import { ok, err, Result, ResultAsync } from "neverthrow";

// After (Zygos) — only change the import, code stays IDENTICAL
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Your existing code works unchanged
```

:::tip Migration
Search & replace `from "neverthrow"` → split into the two imports above. All methods work the same.
:::

### Usage

```typescript
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Sync
const success = ok(42);
const failure = err("Something went wrong");

// Chaining
ok(5)
  .map(x => x * 2)           // Ok(10)
  .mapErr(e => `Error: ${e}`) // Still Ok(10)
  .andThen(x => ok(x + 1));   // Ok(11)

// Async
const asyncResult = ResultAsync.fromPromise(
  fetch("/api/data"),
  () => "Network error"
);
```

--- 

## Option

Handle optional values without null/undefined.

```typescript
import { some, none, fromNullable, Option } from "pithos/zygos/option";

const value = some(42);
const empty = none;

// From nullable
const opt = fromNullable(maybeNull); // Some(value) or None

// Pattern matching
const result = isSome(opt)
  ? opt.value
  : "default";

// Chaining
some(5)
  |> map(x => x * 2)      // Some(10)
  |> flatMap(x => some(x + 1)); // Some(11)
```

---

## Either, Task, TaskEither

Lightweight implementations based on fp-ts, **100% API compatible**.

### Drop-in Replacement for fp-ts

**Migrate from fp-ts with a single line change:**

```typescript
// Before (fp-ts)
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// After (Zygos) — only change the import, code stays IDENTICAL
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";

// Your existing code works unchanged
const result = pipe(
  E.right(5),
  E.map(x => x * 2),
  E.flatMap(x => E.right(x + 1))
);
```

:::tip Migration
Search & replace `from "fp-ts/Either"` → `from "pithos/zygos/either"`, etc. All functions work the same.
:::

### Available functions

| Module | Functions |
|--------|-----------|
| **Either** | `left`, `right`, `isLeft`, `isRight`, `map`, `mapLeft`, `flatMap`, `fold`, `match`, `getOrElse`, `orElse`, `fromOption`, `fromNullable`, `tryCatch`, `Do`, `bind`, `bindTo`, `apS`... |
| **Task** | `of`, `map`, `flatMap`, `ap` |
| **TaskEither** | `left`, `right`, `tryCatch`, `fromEither`, `fromTask`, `fromOption`, `map`, `mapLeft`, `flatMap`, `chain`, `fold`, `match`, `getOrElse`, `orElse`, `swap`... |

---

## safe() - Convert throwing functions

Wrap any function that might throw into a Result-returning function.

```typescript
import { safe } from "pithos/zygos/safe";

const safeJsonParse = safe(JSON.parse);

const result = safeJsonParse('{"valid": true}');
// Ok({ valid: true })

const invalid = safeJsonParse('not json');
// Err(SyntaxError: ...)
```

---

## ✅ When to Use

- **API calls** → `ResultAsync` for typed error handling
- **Validation chains** → `Result` with `andThen`
- **Optional data** → `Option` instead of `null | undefined`
- **Wrapping unsafe code** → `safe()` for try/catch elimination

---

## ❌ When NOT to Use

| Need | Use Instead |
|------|-------------|
| Schema validation | [Kanon](./kanon.md) |
| Data transformation | [Arkhe](./arkhe.md) |
| Typed error factories | [Sphalma](./sphalma.md) |

---

## API Reference

[Browse all Zygos functions →](/api/zygos)
