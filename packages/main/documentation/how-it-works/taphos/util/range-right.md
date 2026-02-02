Creates a range of numbers from end to start.
**Deprecated**: Use `range()` with reverse, or generate manually.
```mermaid
flowchart LR
    A["rangeRight(4)"] --> B["[3, 2, 1, 0]"]
```

### Native Equivalent

```typescript
// ❌ rangeRight(n)
// ✅ [...Array(n).keys()].reverse()
// ✅ Array.from({length: n}, (_, i) => n - 1 - i)
```
