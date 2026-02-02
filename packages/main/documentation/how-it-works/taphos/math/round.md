Rounds number to specified precision.
**Deprecated**: Use `Math.round()` directly.
```mermaid
flowchart LR
    A["round(4.006, 2)"] --> B["4.01"]
```

### Native Equivalent

```typescript
// ❌ round(value)
// ✅ Math.round(value)
// ✅ Math.round(value * 100) / 100  // for precision
```
