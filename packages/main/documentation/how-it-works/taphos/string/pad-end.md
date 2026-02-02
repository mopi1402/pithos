Pads the end of a string to a target length.
**Deprecated**: Use `string.padEnd()` directly (ES2017).
```mermaid
flowchart LR
    A["'hello'"] --> B["padEnd(_, 10, '.')"]
    B --> C["'hello.....'"]
```

### Native Equivalent

```typescript
// ❌ padEnd('hello', 10, '.')
// ✅ 'hello'.padEnd(10, '.')
```
