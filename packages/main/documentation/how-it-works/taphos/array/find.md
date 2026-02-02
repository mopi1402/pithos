Returns the first element that passes the predicate.
**Deprecated**: Use `array.find()` directly (ES2015).
```mermaid
flowchart LR
    A["[1, 2, 3, 4]"] --> B["find(_, n => n > 2)"]
    B --> C["3"]
```

### Native Equivalent

```typescript
// ❌ find(arr, predicate)
// ✅ arr.find(predicate)
```
