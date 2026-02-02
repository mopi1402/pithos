Returns the index of the last occurrence of a value.
**Deprecated**: Use `array.lastIndexOf()` directly.
```mermaid
flowchart LR
    A["[1, 2, 3, 2]"] --> B["lastIndexOf(_, 2)"]
    B --> C["3"]
```

### Native Equivalent

```typescript
// ❌ lastIndexOf(arr, value)
// ✅ arr.lastIndexOf(value)
```
