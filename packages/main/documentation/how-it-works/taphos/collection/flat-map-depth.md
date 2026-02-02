Maps and flattens result to specified depth.
**Deprecated**: Use `flatMap()` + `flat(depth)`.
```mermaid
flowchart LR
    A["[1, 2]"] --> B["flatMapDepth(_, n => [[n]], 2)"]
    B --> C["[1, 2]"]
```

### Native Equivalent

```typescript
// ❌ flatMapDepth(arr, fn, depth)
// ✅ arr.flatMap(fn).flat(depth - 1)
```
