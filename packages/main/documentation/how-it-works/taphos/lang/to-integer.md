Converts value to an integer.
**Deprecated**: Use `Math.trunc()` or bitwise `| 0`.
```mermaid
flowchart LR
    A["toInteger(3.7)"] --> B["3"]
```

### Native Equivalent

```typescript
// ❌ toInteger(value)
// ✅ Math.trunc(Number(value))
// ✅ value | 0  // for 32-bit integers
```
