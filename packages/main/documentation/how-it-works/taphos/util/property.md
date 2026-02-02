Creates a function that returns the value at path of a given object.
**Deprecated**: Use an arrow function.
```mermaid
flowchart LR
    A["property('a.b')({ a: { b: 2 } })"] --> B["2"]
```

### Native Equivalent

```typescript
// ❌ property('name')
// ✅ obj => obj.name
// ✅ obj => obj?.nested?.value
```
