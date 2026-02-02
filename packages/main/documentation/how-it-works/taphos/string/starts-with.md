Checks if string starts with the given target.
**Deprecated**: Use `string.startsWith()` directly (ES2015).
```mermaid
flowchart LR
    A["'hello world'"] --> B["startsWith(_, 'hello')"]
    B --> C["true"]
```

### Native Equivalent

```typescript
// ❌ startsWith('hello', 'he')
// ✅ 'hello'.startsWith('he')
```
