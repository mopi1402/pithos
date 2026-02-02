Replaces matches in string.
**Deprecated**: Use `string.replace()` directly.
```mermaid
flowchart LR
    A["'hello'"] --> B["replace(_, 'l', 'L')"]
    B --> C["'heLlo'"]
```

### Native Equivalent

```typescript
// ❌ replace(str, pattern, replacement)
// ✅ str.replace(pattern, replacement)
```
