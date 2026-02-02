Pads string on both sides to target length.
**Deprecated**: Use `padStart()` and `padEnd()` combination.
```mermaid
flowchart LR
    A["'abc'"] --> B["pad(_, 8, '_')"]
    B --> C["'__abc___'"]
```

### Native Equivalent

```typescript
// ❌ pad(str, length, chars)
// ✅ str.padStart((str.length + length) / 2, chars).padEnd(length, chars)
```
