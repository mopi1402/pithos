## `mergeWith`

### **Custom Array Merging** strategies 📍

@keywords: merge, array, custom, strategy, concatenation

Merge objects with custom array handling.
Essential for flexible data merging.

```typescript
import { mergeWith } from "pithos/arkhe/object/merge-with";

const baseConfig = {
  plugins: ["plugin-a", "plugin-b"],
  rules: { semi: "error" },
};

const extendedConfig = {
  plugins: ["plugin-c"],
  rules: { quotes: "warn" },
};

// Concatenate arrays instead of replacing
const merged = mergeWith(baseConfig, extendedConfig, (objValue, srcValue) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return [...objValue, ...srcValue];
  }
  return undefined; // Use default merge for non-arrays
});

console.log(merged);
// { plugins: ["plugin-a", "plugin-b", "plugin-c"], rules: { semi: "error", quotes: "warn" } }
```

### **Numeric Value Accumulation** 📍

@keywords: merge, accumulate, numbers, sum, statistics

Accumulate numeric values during merge.
Critical for aggregating statistics.

```typescript
import { mergeWith } from "pithos/arkhe/object/merge-with";

const week1Stats = {
  visits: 1000,
  clicks: 150,
  conversions: 25,
};

const week2Stats = {
  visits: 1200,
  clicks: 180,
  conversions: 30,
};

// Sum numeric values
const totalStats = mergeWith(week1Stats, week2Stats, (objValue, srcValue) => {
  if (typeof objValue === "number" && typeof srcValue === "number") {
    return objValue + srcValue;
  }
  return undefined;
});

console.log(totalStats);
// { visits: 2200, clicks: 330, conversions: 55 }
```

### **Conditional Overwrite** logic

@keywords: merge, conditional, overwrite, validation, rules

Apply conditional rules when merging values.
Important for complex merge scenarios.

```typescript
import { mergeWith } from "pithos/arkhe/object/merge-with";

const defaultSettings = {
  timeout: 30000,
  retries: 3,
  cache: { enabled: true, ttl: 3600 },
};

const userSettings = {
  timeout: -1, // Invalid value
  retries: 5,
  cache: { enabled: false, ttl: 0 }, // 0 is invalid for ttl
};

// Only accept valid values
const validatedSettings = mergeWith(defaultSettings, userSettings, (objValue, srcValue, key) => {
  // Reject negative timeouts
  if (key === "timeout" && typeof srcValue === "number" && srcValue < 0) {
    return objValue;
  }
  // Reject zero TTL
  if (key === "ttl" && srcValue === 0) {
    return objValue;
  }
  return undefined; // Use default merge
});

console.log(validatedSettings);
// { timeout: 30000, retries: 5, cache: { enabled: false, ttl: 3600 } }
```
