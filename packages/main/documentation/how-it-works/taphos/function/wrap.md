Creates a function that wraps value with wrapper function.
**Deprecated**: Use an arrow function.
```mermaid
flowchart LR
    A["wrap('hello', (v, n) => v + n)"] --> B["fn(n) => 'hello' + n"]
```

### Native Equivalent

```typescript
// ❌ wrap(value, wrapper)
// ✅ (...args) => wrapper(value, ...args)
```
