Performs SameValueZero comparison between two values.
**Deprecated**: Use `===` or `Object.is()` directly.
```mermaid
flowchart LR
    A["eq(1, 1)"] --> B["true"]
    C["eq(NaN, NaN)"] --> D["true"]
```

### Native Equivalent

```typescript
// ❌ eq(a, b)
// ✅ a === b
// ✅ Object.is(a, b)  // for NaN handling
```
