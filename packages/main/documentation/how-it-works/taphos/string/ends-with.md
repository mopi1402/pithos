Checks if string ends with the given target.
**Deprecated**: Use `string.endsWith()` directly (ES2015).
```mermaid
flowchart LR
    A["'hello world'"] --> B["endsWith(_, 'world')"]
    B --> C["true"]
```

### Native Equivalent

```typescript
// ❌ endsWith('hello', 'lo')
// ✅ 'hello'.endsWith('lo')
```
