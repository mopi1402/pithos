Returns the index of the first element that passes the predicate.
**Deprecated**: Use `array.findIndex()` directly (ES2015).
```mermaid
flowchart LR
    A["[1, 2, 3, 4]"] --> B["findIndex(_, n => n > 2)"]
    B --> C["2"]
```

### Native Equivalent

```typescript
// ❌ findIndex(arr, predicate)
// ✅ arr.findIndex(predicate)
```
