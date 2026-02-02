---
sidebar_position: 7
title: API Design
---

# API Design

## Fundamental Principles

### 1. One Function = One Responsibility

```typescript
// ❌ Polymorphic function (Lodash old style)
_.map(collection, iteratee, [thisArg]);
// Accepts array, object, string... confusion

// ✅ Specialized functions
mapArray(array, fn); // For arrays
mapObject(object, fn); // For objects
mapString(string, fn); // For strings
```

### 2. Explicit and Consistent Naming

| Pattern          | Convention               | Examples                                |
| ---------------- | ------------------------ | --------------------------------------- |
| **Action verbs** | Verbs for transformation | `chunk`, `flatten`, `merge`, `debounce` |
| **Predicates**   | `is`/`has`/`can` + Noun  | `isEmpty`, `hasOwn`, `canRead`          |
| **Transformers** | Verb + Noun              | `toString`, `toNumber`, `toArray`       |
| **Accessors**    | `get`/`set` + Property   | `getFirst`, `getLast`, `getAt`          |
| **Mutables**     | Base + `Mut`             | `shuffleMut`, `sortMut`, `reverseMut`   |
| **Async**        | Base + `Async`           | `mapAsync`, `filterAsync`               |

**No cryptic abbreviations**: Prefer full words over abbreviations (`debounce` ✅, `dbnc` ❌). Common abbreviations are acceptable (`min`, `max`, `id`).

```typescript
// ✅ Good: Action verbs
export function chunk<T>(array: T[], size: number): T[][];
export function merge<T>(target: T, source: Partial<T>): T;

// ✅ Good: Predicates
export function isEmpty<T>(value: T | null | undefined): boolean;

// ❌ Bad: Cryptic abbreviations
export function dbnc(fn: Function, wait: number): Function;
```

### 3. Predictable Signatures

```typescript
// Consistent pattern: (input, ...options) => output
chunk(array, size); // (T[], number) => T[][]
take(array, count); // (T[], number) => T[]
groupBy(array, keyFn); // (T[], (T) => K) => Record<K, T[]>
```

### 4. No Complex Configuration

```typescript
// ❌ Too many options (confusing)
sort(array, {
  direction: "desc",
  compareBy: "name",
  nullsFirst: true,
  locale: "fr-FR",
});

// ✅ Composable functions
sortBy(array, (item) => item.name);
sortByDesc(array, (item) => item.name);
// For complex cases, use native comparators
array.sort((a, b) => customLogic(a, b));
```

### 5. Simplicity Before Exhaustiveness

**Principle**: Prefer a simple function that covers 99% of use cases over a complex function with many options for rare edge cases.

```typescript
// ❌ Unnecessary complexity (es-toolkit style)
export function windowed<T>(
  arr: readonly T[],
  size: number,
  step = 1,
  { partialWindows = false }: WindowedOptions = {}
): T[][] {
  /* ... */
}

// ✅ Simple and effective (Pithos style)
export function window<T>(array: readonly T[], size: number): T[][] {
  /* ... */
}
```

**Why this approach?**

- **80/20 Rule**: Complex options only serve 1% of cases
- **Maintenance**: More code = more potential bugs
- **API Surface**: A smaller API is easier to learn and use
- **Composition**: For rare cases, compose multiple simple functions
- **Bundle Size**: Less code = smaller bundle

**When to add an option?**

✅ Add an option if:

- It addresses a frequent need (more than 10% of uses)
- It significantly improves performance
- It solves an important architectural problem

❌ Don't add an option if:

- It only serves rare edge cases (less than 1%)
- It can easily be composed with other functions
- It adds complexity without clear benefit

**Alternative: Composition**

For complex cases, prefer composition over options:

```typescript
// For rare cases needing partialWindows or custom step
// We compose rather than add options
const result = pipe(
  array,
  (arr) => window(arr, size),
  (windows) => windows.filter(/* custom logic */)
);
```
