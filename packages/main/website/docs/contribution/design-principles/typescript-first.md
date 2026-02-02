---
sidebar_position: 5
title: TypeScript-First
---

# TypeScript-First

## Not "TypeScript-Ready", But "TypeScript-First"

The difference is crucial:

```typescript
// ❌ TypeScript-ready (Lodash) - Types added as an afterthought
// Types are often approximate or too permissive
declare function get(object: any, path: string): any;

// ✅ TypeScript-first (Pithos) - Designed for inference
// Precise types, automatically inferred
const get = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
```

## Pithos Rules

| Principle                  | Application                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Maximum inference**      | Never `any`, rarely explicit generics                                                                                                                                    |
| **Automatic narrowing**    | Type guards narrow types                                                                                                                                                 |
| **Compile-time errors**    | Catch bugs before execution                                                                                                                                              |
| **IDE intelligence**       | Autocompletion, refactoring, go-to-definition                                                                                                                            |
| **No Runtime Type Checks** | Never check types at runtime (`typeof`, `instanceof`, `Array.isArray`). TypeScript guarantees types at compile time. Only check invalid values/ranges (e.g., `size < 0`) |
| **Explicit type naming**   | Prefer explicit names for generic types (like React/React Native), except for `T` or trivially obvious types                                                             |

## Inference Examples

```typescript
import { chunk } from "pithos/arkhe/array/chunk";

const numbers = [1, 2, 3, 4, 5, 6];
const chunks = chunk(numbers, 2);
//    ^? T[][] inferred as number[][]

// The type is automatically preserved
chunks.forEach((group) => {
  group.forEach((n) => console.log(n.toFixed(2)));
  //                              ^? number inferred
});
```

## No Any, No Escape Hatches

```typescript
// ❌ NEVER
const process = (data: any) => { ... }

// ✅ ALWAYS
const process = <T>(data: T) => { ... }
// or with constraints
const process = <T extends Record<string, unknown>>(data: T) => { ... }
```

## Explicit Type Naming (React/React Native Style)

Pithos follows the same philosophy as React and React Native: giving explicit and descriptive names to generic types rather than using single letters (except for trivial cases).

```typescript
// ❌ Opaque generic types (avoid)
const map = <T, R>(
  array: T[],
  fn: (item: T) => R
): R[] => { ... };

const createValidator = <T, E = Error>(
  schema: T,
  onError: (err: E) => void
) => { ... };

// ✅ Explicit names (prefer, React Native style, no T prefix)
const map = <Item, Result>(
  array: Item[],
  fn: (item: Item) => Result
): Result[] => { ... };

const createValidator = <Schema, ValidationError = Error>(
  schema: Schema,
  onError: (err: ValidationError) => void
) => { ... };

// ✅ Acceptable: `T` alone is OK for simple and obvious cases
const chunk = <T>(array: T[], size: number): T[][] => { ... };
const isEqual = <T>(a: T, b: T): boolean => { ... };
```

**When to use explicit names?**

- ✅ **Multiple generics**: `Item`, `Result`, `Key`, `Value` rather than `T`, `R`, `K`, `V`
- ✅ **Complex types**: `User`, `Config`, `Options` rather than `T`, `C`, `O`
- ✅ **Types with clear roles**: `Error`, `Schema`, `Validator` rather than `E`, `S`, `V`
- ✅ **Readability improvement**: When the explicit name makes the code clearer

**When is `T` alone acceptable?**

- ✅ **Single simple generic**: `chunk<T>(array: T[])`
- ✅ **Obvious context**: `isEqual<T>(a: T, b: T)` - we immediately understand that `T` is the compared type
- ✅ **Well-established convention**: `Array<T>`, `Promise<T>` - widely recognized patterns
- ✅ **With multiple generics**: `T` can remain `T` if other generics are already explicit (e.g., `Key`, `Criterion`) and there's no ambiguity about what `T` represents (usually the element type)

```typescript
// ✅ Good: T stays T because Key is explicit and T clearly represents the element type
export function unionBy<T, Key>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => Key
): T[] { ... }

// ✅ Good: T stays T because Criterion is explicit
export function findBest<T, Criterion>(
  array: readonly T[],
  iteratee: (value: T) => Criterion,
  compareFn: (a: Criterion, b: Criterion) => boolean
): T | undefined { ... }
```

This approach improves readability, facilitates refactoring, and makes the code's intent clearer, particularly in public APIs.
