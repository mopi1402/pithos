Assigns source properties to destination (alias for assign).
**Deprecated**: Use `Object.assign()` or spread operator.
```mermaid
flowchart LR
    A["{ a: 1 }"] --> C["extend(_, { b: 2 })"]
    C --> D["{ a: 1, b: 2 }"]
```

### Native Equivalent

```typescript
// ❌ extend(target, source)
// ✅ Object.assign(target, source)
// ✅ { ...target, ...source }
```
