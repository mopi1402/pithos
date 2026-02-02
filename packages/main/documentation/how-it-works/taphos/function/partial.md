Creates a function with partial arguments applied.
**Deprecated**: Use `Function.prototype.bind()` or arrow functions.
```mermaid
flowchart LR
    A["partial(add, 5)"] --> B["(y) => add(5, y)"]
    B --> C["add5(3) → 8"]
```

### Native Equivalent

```typescript
// ❌ partial(fn, arg1)
// ✅ fn.bind(null, arg1)
// ✅ (arg2) => fn(arg1, arg2)
```
