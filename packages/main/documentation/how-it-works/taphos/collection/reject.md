Returns elements that do NOT pass the predicate (opposite of filter).
**Deprecated**: Use `array.filter()` with negated predicate.
```mermaid
flowchart LR
    A["[1, 2, 3, 4]"] --> B["reject(_, n => n > 2)"]
    B --> C["[1, 2]"]
```

### Native Equivalent

```typescript
// ❌ reject(arr, predicate)
// ✅ arr.filter(x => !predicate(x))
```
