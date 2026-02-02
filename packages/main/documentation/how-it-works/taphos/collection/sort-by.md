Creates an array sorted by iteratees.
**Deprecated**: Use `array.toSorted()` (ES2023) or `[...arr].sort()`.
```mermaid
flowchart LR
    A["[{n: 3}, {n: 1}, {n: 2}]"] --> B["sortBy(_, 'n')"]
    B --> C["[{n: 1}, {n: 2}, {n: 3}]"]
```

### Native Equivalent

```typescript
// ❌ sortBy(arr, 'age')
// ✅ [...arr].sort((a, b) => a.age - b.age)
// ✅ arr.toSorted((a, b) => a.age - b.age)  // ES2023
```
