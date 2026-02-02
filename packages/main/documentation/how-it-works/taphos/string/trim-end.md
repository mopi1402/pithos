Removes whitespace from end of string.
**Deprecated**: Use `string.trimEnd()` directly (ES2019).
```mermaid
flowchart LR
    A["'hello  '"] --> B["trimEnd(_)"]
    B --> C["'hello'"]
```

### Native Equivalent

```typescript
// ❌ trimEnd(str)
// ✅ str.trimEnd()
```
