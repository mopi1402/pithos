Iterates over own enumerable properties.
**Deprecated**: Use `Object.entries()` with `forEach`.
```mermaid
flowchart LR
    A["forOwn(obj, fn)"] --> B["Object.entries(obj).forEach(...)"]
```

### Native Equivalent

```typescript
// ❌ forOwn(obj, fn)
// ✅ Object.entries(obj).forEach(([k, v]) => fn(v, k, obj))
```
