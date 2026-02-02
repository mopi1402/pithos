Removes whitespace from both ends of a string.
**Deprecated**: Use `string.trim()` directly.
```mermaid
flowchart LR
    A["'  hello  '"] --> B["trim(_)"]
    B --> C["'hello'"]
```

### Native Equivalent

```typescript
// ❌ trim('  hello  ')
// ✅ '  hello  '.trim()
```
