Removes all given values from an array (mutates).
**Deprecated**: Use immutable `filter()` or `without()` instead.
```mermaid
flowchart LR
    A["[1, 2, 3, 1, 2]"] --> B["pull(_, 1, 2)"]
    B --> C["[3] (mutated)"]
```

### Native Equivalent

```typescript
// ❌ pull(arr, ...values)  // mutates
// ✅ arr.filter(x => !values.includes(x))  // immutable
```
