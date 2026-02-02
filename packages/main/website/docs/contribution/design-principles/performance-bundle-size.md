---
sidebar_position: 8
title: Performance & Bundle Size
---

# Performance & Bundle Size

## Principles

| Goal                  | Strategy                                   |
| --------------------- | ------------------------------------------ |
| **Tree-shaking**      | Granular exports, no barrel exports        |
| **Zero dependencies** | No external dependencies                   |
| **Modern APIs**       | Use native APIs when equivalent            |
| **No dead code**      | No legacy code for old browsers            |
| **Loop optimization** | Prefer `for` loops for critical operations |

## Loop Optimization

For performance-critical operations, prefer `for` loops over chained methods (`map`, `filter`, `reduce`). `for` loops avoid intermediate allocations and function call overhead.

```typescript
// ✅ Good: for loop for performance
export function keyBy<T>(
  array: readonly T[],
  iteratee: (value: T) => PropertyKey
): Record<string, T> {
  const result: Record<string, T> = {};
  for (let i = 0; i < array.length; i++) {
    const key = String(iteratee(array[i]));
    result[key] = array[i];
  }
  return result;
}

// ✅ Good: Array methods are acceptable for simple, readable code
export function difference<T>(array: readonly T[], values: readonly T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}
```

**Complexity documentation**: Use the `@performance` tag in TSDoc to document time complexity (O(n), O(n²), etc.) when relevant.

## Import Structure

```typescript
// ✅ Direct import (optimal tree-shaking)
import { chunk } from "pithos/arkhe/array/chunk";
import { isString } from "pithos/arkhe/is/isString";

// ⚠️ Grouped import (acceptable, tree-shakeable)
import { chunk, map, filter } from "pithos/arkhe/array";

// ❌ Global import (avoid, includes everything)
import * as Arkhe from "pithos/arkhe";
```

## ES2020+ Target

Pithos targets ES2020+ to benefit from modern APIs:

```typescript
// Using modern native APIs
Object.fromEntries()    // instead of custom fromPairs
Array.prototype.flat()  // instead of custom flatten
??                      // nullish coalescing
?.                      // optional chaining
```

:::tip

**Philosophy**: If a native API does the job, don't reimplement it.

Document the native alternative in Taphos (deprecated utilities).

:::
