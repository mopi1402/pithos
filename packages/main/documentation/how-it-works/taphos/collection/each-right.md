Iterates over elements from right to left.
**Deprecated**: Use `array.reverse().forEach()` or loop backward.
```mermaid
flowchart LR
    A["[1, 2, 3]"] --> B["eachRight(_, console.log)"]
    B --> C["logs: 3, 2, 1"]
```

### Native Equivalent

```typescript
// ❌ eachRight(arr, fn)
// ✅ [...arr].reverse().forEach(fn)
// ✅ for (let i = arr.length - 1; i >= 0; i--) fn(arr[i])
```
