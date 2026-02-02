Creates an array excluding specified values.
**Deprecated**: Use `array.filter()` directly.
```mermaid
flowchart LR
    A["[1, 2, 3, 1, 2]"] --> B["without(_, 1, 2)"]
    B --> C["[3]"]
```

### Native Equivalent

```typescript
// ❌ without(arr, 1, 2)
// ✅ arr.filter(x => x !== 1 && x !== 2)
// ✅ arr.filter(x => ![1, 2].includes(x))
```
