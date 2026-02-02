Creates an object from key-value pairs.
**Deprecated**: Use `Object.fromEntries()` directly (ES2019).
```mermaid
flowchart LR
    A["[['a', 1], ['b', 2]]"] --> B["fromPairs(_)"]
    B --> C["{ a: 1, b: 2 }"]
```

### Native Equivalent

```typescript
// ❌ fromPairs(pairs)
// ✅ Object.fromEntries(pairs)
```
