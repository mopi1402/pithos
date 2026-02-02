Returns the item at the given index, supporting negative indices.
**Deprecated**: Use `array.at(index)` directly (ES2022).
```mermaid
flowchart LR
    A["[1, 2, 3, 4, 5]"] --> B["at(_, 0)"]
    B --> C["1"]
    
    D["[1, 2, 3, 4, 5]"] --> E["at(_, -1)"]
    E --> F["5"]
```

### Negative Index

```mermaid
flowchart LR
    A["index: -1"] --> B["length + (-1)"]
    B --> C["5 + (-1) = 4"]
    C --> D["arr[4] = 5"]
```

### Native Equivalent

```typescript
// ❌ at(arr, -1)
// ✅ arr.at(-1)
```
