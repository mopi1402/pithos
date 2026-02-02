## `isEqual`

### **Deep Object Comparison** for state changes 📍

@keywords: deep comparison, equality, state, objects, changes

Compare complex objects to detect state changes.
Essential for React/Vue change detection and memoization.

```typescript
import { isEqual } from "pithos/arkhe/is/predicate/is-equal";

const prevState = {
  user: { name: "John", settings: { theme: "dark", notifications: true } },
  items: [1, 2, 3],
};

const nextState = {
  user: { name: "John", settings: { theme: "dark", notifications: true } },
  items: [1, 2, 3],
};

// Deep comparison - returns true even though different references
console.log(isEqual(prevState, nextState)); // true
console.log(prevState === nextState); // false (reference comparison)

// Detect actual changes
const changedState = { ...nextState, user: { ...nextState.user, name: "Jane" } };
console.log(isEqual(prevState, changedState)); // false
```

### **Test Assertions** for complex data 📍

@keywords: testing, assertions, equality, comparison, validation

Assert equality of complex data structures in tests.
Critical for comprehensive test coverage.

```typescript
import { isEqual } from "pithos/arkhe/is/predicate/is-equal";

function testUserTransformation() {
  const input = { firstName: "John", lastName: "Doe", age: 30 };
  const result = transformUser(input);

  const expected = {
    fullName: "John Doe",
    age: 30,
    metadata: { transformed: true, timestamp: result.metadata.timestamp },
  };

  if (!isEqual(result, expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
  }

  console.log("Test passed!");
}

// Works with special types too
console.log(isEqual(new Date("2024-01-01"), new Date("2024-01-01"))); // true
console.log(isEqual(/abc/gi, /abc/gi)); // true
console.log(isEqual(new Set([1, 2]), new Set([1, 2]))); // true
console.log(isEqual(new Map([["a", 1]]), new Map([["a", 1]]))); // true
```

### **Cache Invalidation** with key comparison

@keywords: cache, invalidation, comparison, memoization, keys

Determine if cached values should be invalidated.
Important for efficient caching strategies.

```typescript
import { isEqual } from "pithos/arkhe/is/predicate/is-equal";

class MemoizedFetcher {
  private cache = new Map<string, { params: unknown; data: unknown }>();

  async fetch(key: string, params: unknown): Promise<unknown> {
    const cached = this.cache.get(key);

    // Check if params are the same (deep comparison)
    if (cached && isEqual(cached.params, params)) {
      console.log(`Cache hit for ${key}`);
      return cached.data;
    }

    console.log(`Cache miss for ${key}, fetching...`);
    const data = await this.fetchFromApi(key, params);
    this.cache.set(key, { params, data });
    return data;
  }

  private async fetchFromApi(key: string, params: unknown) {
    // Simulate API call
    return { key, params, timestamp: Date.now() };
  }
}

const fetcher = new MemoizedFetcher();
await fetcher.fetch("users", { page: 1, limit: 10 }); // Cache miss
await fetcher.fetch("users", { page: 1, limit: 10 }); // Cache hit
await fetcher.fetch("users", { page: 2, limit: 10 }); // Cache miss (different params)
```
