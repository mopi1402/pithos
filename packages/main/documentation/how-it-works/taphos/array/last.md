Gets the last element of an array.
**Deprecated**: Use `array[array.length - 1]` or `array.at(-1)` directly.
```mermaid
flowchart LR
    A["[1, 2, 3, 4, 5]"] --> B["last(_)"]
    B --> C["5"]
```

### Native Equivalent

```typescript
// ❌ last(arr)
// ✅ arr[arr.length - 1]
// ✅ arr.at(-1)  // ES2022
```
