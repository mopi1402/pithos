Returns the first argument it receives.
**Deprecated**: Use an inline arrow function `(x) => x` instead.
```mermaid
flowchart LR
    A["identity(5)"] --> B["5"]
```

### Native Equivalent

```typescript
// ❌ arr.filter(identity)
// ✅ arr.filter(x => x)
// ✅ arr.filter(Boolean)
```
