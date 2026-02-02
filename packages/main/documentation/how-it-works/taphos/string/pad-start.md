Pads the start of a string to a target length.
**Deprecated**: Use `string.padStart()` directly (ES2017).
```mermaid
flowchart LR
    A["'42'"] --> B["padStart(_, 5, '0')"]
    B --> C["'00042'"]
```

### Native Equivalent

```typescript
// ❌ padStart('42', 5, '0')
// ✅ '42'.padStart(5, '0')
```
