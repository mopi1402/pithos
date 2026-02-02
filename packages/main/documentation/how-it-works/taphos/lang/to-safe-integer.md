Converts value to a safe integer.
**Deprecated**: Use `Math.trunc()` with bounds check.
```mermaid
flowchart LR
    A["toSafeInteger(3.7)"] --> B["3"]
    C["toSafeInteger(Infinity)"] --> D["MAX_SAFE_INTEGER"]
```

### Native Equivalent

```typescript
// ❌ toSafeInteger(value)
// ✅ Math.max(
//      Number.MIN_SAFE_INTEGER,
//      Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(value))
//    )
```
