Casts value to an array if not already.
**Deprecated**: Use `Array.isArray()` with conditional.
```mermaid
flowchart LR
    A["castArray(1)"] --> B["[1]"]
    C["castArray([1, 2])"] --> D["[1, 2]"]
```

### Native Equivalent

```typescript
// ❌ castArray(value)
// ✅ Array.isArray(value) ? value : [value]
```
