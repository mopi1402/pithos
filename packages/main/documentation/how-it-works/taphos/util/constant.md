Creates a function that returns a constant value.
**Deprecated**: Use an inline arrow function `() => value` instead.
```mermaid
flowchart LR
    A["constant(5)"] --> B["() => 5"]
    B --> C["fn() → 5"]
```

### Native Equivalent

```typescript
// ❌ constant(value)
// ✅ () => value
```
