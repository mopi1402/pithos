Iterates over own and inherited enumerable properties.
**Deprecated**: Use `for...in` loop directly.
```mermaid
flowchart LR
    A["forIn(obj, fn)"] --> B["for (key in obj) fn(obj[key], key)"]
```

### Native Equivalent

```typescript
// ❌ forIn(obj, fn)
// ✅ for (const key in obj) fn(obj[key], key, obj)
```
