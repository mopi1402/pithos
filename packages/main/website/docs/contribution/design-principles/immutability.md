---
sidebar_position: 4
title: Immutability vs Mutability
---

# Immutability vs Mutability

## The Question

> _Should we always use mutable or immutable operations?_

## The Answer: **Immutable by Default**

```typescript
// ❌ Mutable (Lodash style) - AVOID
const array = [1, 2, 3];
_.reverse(array); // Modifies the original!
console.log(array); // [3, 2, 1] 😱

// ✅ Immutable (Pithos style) - PREFER
const array = [1, 2, 3];
const reversed = reverse(array); // New instance
console.log(array); // [1, 2, 3] ✓
console.log(reversed); // [3, 2, 1] ✓
```

## Pithos Rules

| Principle                       | Implementation                                      |
| ------------------------------- | --------------------------------------------------- |
| **Immutable by default**        | All functions return new instances                  |
| **No side effects**             | Functions never modify their arguments              |
| **Predictable behavior**        | Same input = same output (referential transparency) |
| **Mutable variants (optional)** | `Mut` suffix for rare performance-critical cases    |

## The Rare Exceptions

For performance-critical cases where mutation is necessary:

```typescript
// Immutable version (default)
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  // ... Fisher-Yates on result
  return result;
};

// Mutable version (optional, for performance)
export const shuffleMut = <T>(array: T[]): T[] => {
  // ... Fisher-Yates in-place
  return array; // Returns the same modified array
};
```

## Why Immutable?

- **Predictability**: Easier to reason about and debug
- **React/Vue/Solid**: Modern frameworks expect immutability
- **Concurrent safety**: No race conditions with shared data
- **Time-travel debugging**: Redux DevTools, etc.
- **Pure functions**: Better for tests and composition

:::tip

**Performance**: With modern JS engines (V8), the cost of copying is often negligible.

Optimize only after measuring a real bottleneck.

:::
