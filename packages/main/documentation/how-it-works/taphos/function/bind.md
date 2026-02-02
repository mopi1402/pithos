Creates a function bound to a specific context.
**Deprecated**: Use `Function.prototype.bind()` directly.
```mermaid
flowchart LR
    A["bind(fn, context)"] --> B["fn.bind(context)"]
```

### Native Equivalent

```typescript
// ❌ bind(fn, context, ...args)
// ✅ fn.bind(context, ...args)
```
