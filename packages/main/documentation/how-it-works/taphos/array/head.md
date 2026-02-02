Gets the first element of an array.
**Deprecated**: Use `array[0]` or `array.at(0)` directly.
```mermaid
flowchart LR
    A["[1, 2, 3, 4, 5]"] --> B["head(_)"]
    B --> C["1"]
```

### Empty Array

```mermaid
flowchart LR
    A["[]"] --> B["head(_)"]
    B --> C["undefined"]
```

### Native Equivalent

```typescript
// ❌ head(arr)
// ✅ arr[0]
// ✅ arr.at(0)
```
