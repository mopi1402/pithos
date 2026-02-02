Assigns source properties to destination object.
**Deprecated**: Use `Object.assign()` or spread operator directly (ES2015).
```mermaid
flowchart LR
    A["{ a: 1 }"] --> C["assign(_, { b: 2 })"]
    C --> D["{ a: 1, b: 2 }"]
```

### Native Equivalent

```typescript
// ❌ assign(target, source)
// ✅ Object.assign(target, source)
// ✅ { ...target, ...source }
```
