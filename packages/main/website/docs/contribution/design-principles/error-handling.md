---
sidebar_position: 3
title: Error Handling
description: "Error handling philosophy in Pithos: fail fast, fail loud. Why explicit errors are better than silent failures for TypeScript utilities."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Error Handling

## The Fundamental Question

> _Should we silently mask errors, return `undefined`, or throw errors?_

## The Modern Answer: **Fail Fast, Fail Loud**

```typescript
// ❌ Lodash approach (silent failure) - AVOID
_.get(null, "a.b.c"); // → undefined (masks the problem)

// ✅ Modern approach (explicit failure) - PREFER
get(null, "a.b.c"); // → throw TypeError("Expected object, got null")
```

## Pithos Rules

| Situation                | Error Type              | Responsible Module      | Approach                  | Example                     |
| ------------------------ | ----------------------- | ----------------------- | ------------------------- | --------------------------- |
| Misuse / Invariant       | **Developer Error**     | **Arkhe** (Foundations) | `Throw Error` (Fail Fast) | `throw new TypeError()`     |
| Possible absence         | **Expected Absence**    | All                     | `undefined`               | `find(...) ?? undefined`    |

## Concrete Examples

```typescript
// 1️⃣ Invalid input → THROW
const chunk = <T>(array: T[], size: number): T[][] => {
  // ✅ We check values, not parameter types
  // TypeScript already guarantees that array is T[] and size is number
  if (size <= 0 || !Number.isInteger(size)) {
    throw new RangeError("Chunk size must be a positive integer, got " + size);
  }
  // ... implementation
};

// ❌ NEVER check parameter types
const badChunk = <T>(array: T[], size: number): T[][] => {
  if (!Array.isArray(array)) {
    // ❌ TypeScript already guarantees that array is T[]
    throw new TypeError("Expected array");
  }
  if (typeof size !== "number") {
    // ❌ TypeScript already guarantees that size is number
    throw new TypeError("Expected number");
  }
  // ...
};

// 2️⃣ Expected absent value → UNDEFINED
const find = <T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  for (const item of array) {
    if (predicate(item)) return item;
  }
  return undefined; // Not found = normal case
};

// 3️⃣ Fallible operation → RESULT (via Zygos)
const parseJSON = (json: string): Result<unknown, SyntaxError> => {
  try {
    return ok(JSON.parse(json));
  } catch (error) {
    return err(error as SyntaxError);
  }
};
```

## Why This Choice?

- **Easier debugging**: Silent errors cause hard-to-trace bugs
- **Fail fast**: Detect problems as early as possible in the development cycle
- **TypeScript alignment**: The type system reflects actual behavior
- **Modern JS ecosystem**: Compatible with `?.` and `??` for absent values

:::important

**Golden rule**: If the input is malformed, it's a developer error → throw.

If the value is simply absent, it's a normal case → undefined.

:::

## Return Values

### Consistent Return Types

- **`T | undefined`**: Acceptable when absence is semantically meaningful (e.g., `findBest`, `sample`, `minBy` return `undefined` when no element is found).
- **Empty collections**: Return `[]` (empty array) when an empty collection is a valid result. Throw an error when an empty collection indicates invalid input (follow the "Fail Fast" principle).

```typescript
// ✅ Good: undefined is semantically correct for "not found"
export function sample<T>(array: readonly T[]): T | undefined {
  return array.length ? array[Math.floor(Math.random() * array.length)] : undefined;
}

// ✅ Good: Empty array for valid empty result
export function unionBy<T, Key>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => Key
): T[] {
  if (arrays.length === 0) return []; // Valid: no arrays to union = empty result
  // ...
}

// ✅ Good: Throw when an empty collection indicates invalid input
export function process<T>(array: T[]): T[] {
  if (array.length === 0) {
    throw new RangeError("Array must not be empty"); // Invalid: function requires at least one element
  }
  // ...
}

// ❌ Bad: Inconsistent return type
export function process<T>(array: T[]): T[] | undefined {
  return array.length > 0 ? array.map(...) : undefined; // Should return [] if empty is valid, or throw if invalid
}
```

**Documentation**: Explicitly document return values for edge cases in TSDoc.

## Boundary Validation

### What is a "boundary"?

A boundary is any data source **not guaranteed by TypeScript**:

- ✅ External API (fetch, WebSocket)
- ✅ Storage (localStorage, sessionStorage, IndexedDB)
- ✅ User input (forms, URL params)
- ✅ `JSON.parse()` (returns `any`)
- ✅ Third-party libs returning `any` or incorrect types
- ✅ Legacy JavaScript code without reliable types

**Rule**: If TypeScript can't guarantee the type → Validate with Kanon

#### The Crucial Question

> _If the backend sends me a `string` instead of a `number`, who's responsible?_

#### Validation Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  🌍 OUTSIDE WORLD (untyped, unreliable)                 │
│  • Backend API                                          │
│  • localStorage / sessionStorage                        │
│  • URL params / query strings                           │
│  • User input (forms)                                   │
│  • WebSocket messages                                   │
│  • Uploaded files                                       │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │  🛡️ VALIDATION       │  ← Kanon (schema validation)
           │  (Boundary)          │    Zygos Result for errors
           │                      │
           │  Responsible for:    │
           │  • Validating types  │
           │  • Parsing data      │
           │  • Reporting errors  │
           │    properly          │
           └────────┬─────────────┘
                    │ ✅ Validated and typed data
                    ▼
┌─────────────────────────────────────────────────────────┐
│  🏛️ INTERNAL WORLD (typed, reliable)                    │
│  • Arkhe utilities                                      │
│  • Business logic                                       │
│  • React/Vue/Solid Components                           │
│                                                         │
│  Arkhe ASSUMES data is already validated.               │
│  If it's not → throw (developer error)                  │
└─────────────────────────────────────────────────────────┘
```

#### Concrete Example: Backend Data

```typescript
import { validation } from "@pithos/core/kanon/validation";
import { chunk } from "@pithos/core/arkhe/array/chunk";

// 1️⃣ Validation schema (BOUNDARY)
const UserResponseSchema = validation.object({
  id: validation.string(),
  scores: validation.array(validation.number()), // ← MUST be number[]
});

// 2️⃣ Fetch + Validation at the boundary
async function fetchUser(userId: string) {
  const response = await fetch("/api/users/" + userId);
  const rawData = await response.json(); // ← Type: unknown

  // Validation with Kanon
  const result = UserResponseSchema.safeParse(rawData);

  if (!result.success) {
    // ⚠️ The backend sent invalid data
    // This is an API CONTRACT problem, not an Arkhe problem
    console.error("API contract violation:", result.error);
    throw new Error("Invalid API response: " + result.error.message);
  }

  return result.data; // ← Type: { id: string; scores: number[] }
}

// 3️⃣ Safe Arkhe usage
async function processUser(userId: string) {
  const user = await fetchUser(userId); // ← Validated data

  // At this point, TypeScript KNOWS that user.scores is number[]
  const scoreGroups = chunk(user.scores, 5); // ← 100% type-safe!

  return scoreGroups;
}
```

#### Who Is Responsible for What?

| Data Source                 | Responsible | Action                       |
| --------------------------- | ----------- | ---------------------------- |
| Dev misuses Arkhe API       | **Arkhe**   | `throw TypeError`            |
| Backend sends wrong types   | **Kanon**   | Validation + error reporting |
| Invalid user input          | **Kanon**   | Form validation              |
| Corrupted localStorage      | **Kanon**   | Parse + validate             |
| Malformed WebSocket message | **Kanon**   | Schema validation            |

:::caution

**Arkhe does NOT validate external data.**

Its role is to be a performant utility library, not a validation system.

Validation belongs at the **boundary** (Kanon, Zod, or custom validation).

:::

#### Anti-Pattern: Validation in Arkhe

```typescript
// ❌ ANTI-PATTERN: Don't do this in Arkhe
const chunk = <T>(array: T[], size: number): T[][] => {
  // External data validation ← NOT ARKHE'S ROLE
  if (typeof array === "string") {
    return []; // Silent failure for invalid data
  }
  // ...
};

// ✅ CORRECT: Arkhe assumes valid data (TypeScript guarantees types)
const chunk = <T>(array: T[], size: number): T[][] => {
  // Only check invalid values, not types
  if (size <= 0 || !Number.isInteger(size)) {
    throw new RangeError("Chunk size must be a positive integer, got " + size);
  }
  // ...
};
```

#### Philosophy Summary

The guiding principle behind Arkhe's error handling can be summarized as follows: TypeScript's type system is the first line of defense, and runtime checks only cover values that types cannot express (like positive integers or non-empty arrays):

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   "Arkhe trusts TypeScript types.                       │
│    If types are wrong at runtime, it means              │
│    boundary validation wasn't done."                    │
│                                                         │
│    → This is NOT Arkhe's problem.                       │
│    → It's the problem of the code calling Arkhe.        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Coded Errors with Sphalma


### Current Architecture

Sphalma provides a `CodedError` class that extends the native `Error` with a numeric code, a human-readable type string, and optional structured details. This pattern enables programmatic error matching while keeping stack traces and developer-friendly messages intact:

```typescript
// sphalma/error-factory.ts
export class CodedError extends Error {
  constructor(
    public readonly code: number,
    public readonly type: string,
    public readonly details?: unknown
  ) {
    super("[" + type + ":" + code + "]");
  }
}
```

### Hexadecimal Convention `0xMFEE`

To maximize capacity and technical readability, Pithos uses a 4-digit hexadecimal format:

```text
Format: 0x M F EE
           │ │ └── Error (00-FF) → 256 errors / feature
           │ └──── Feature (0-F)  → 16 features / module
           └────── Module (1-F)   → 15 modules
```

### Code Ranges by Module

| Module (M)       | Feature (F) | Hex Range         | Description         |
| ---------------- | ----------- | ----------------- | ------------------- |
| **3** (Kanon)    | **0**       | `0x3000 - 0x30FF` | Validation (future) |

### Usage Example

```typescript
import { createErrorFactory } from "@pithos/core/sphalma/error-factory";

// Define codes (Hex)
export const AnimationErrorCodes = {
  ANIMATION_ALREADY_EXISTS: 0x1000,
  ANIMATION_NOT_FOUND: 0x1001,
  INVALID_ANIMATION_ID: 0x1002,
} as const;

// Typed factory
export const createAnimationError =
  createErrorFactory<
    (typeof AnimationErrorCodes)[keyof typeof AnimationErrorCodes]
  >("Animation");

// Usage
throw createAnimationError(AnimationErrorCodes.ANIMATION_NOT_FOUND, {
  id: "fade-out",
});
// → Error: [Animation:101] with details.id = "fade-out"
```

:::tip

**Coded Errors Advantages:**

- **Debugging**: The code `[Animation:0x1001]` immediately identifies the error
- **Logs**: Easy to filter/search in logs

:::

---

<RelatedLinks>

- [Sphalma — Typed Error Factories](../../modules/sphalma.md) — Structured errors with hex codes
- [Zygos — Error Handling](../../modules/zygos.md) — Result, Option, Either, and Task patterns
- [Immutability vs Mutability](./immutability.md) — Why Pithos defaults to immutable operations

</RelatedLinks>
