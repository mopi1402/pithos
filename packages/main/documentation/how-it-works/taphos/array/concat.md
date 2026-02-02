Creates a new array concatenating arrays/values.
**Deprecated**: Use `array.concat()` or spread operator directly.
```mermaid
flowchart LR
    A["[1]"] --> C["concat(_, 2, [3], [[4]])"]
    C --> D["[1, 2, 3, [4]]"]
```

### Native Equivalent

```typescript
// ❌ concat(arr, 2, [3])
// ✅ arr.concat(2, [3])
// ✅ [...arr, 2, ...other]
```
