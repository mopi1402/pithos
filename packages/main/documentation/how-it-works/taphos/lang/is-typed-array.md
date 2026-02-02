Checks if value is a typed array.
**Deprecated**: Use `ArrayBuffer.isView()` or instanceof checks.
```mermaid
flowchart LR
    A["isTypedArray(new Uint8Array())"] --> B["true"]
```

### Native Equivalent

```typescript
// ❌ isTypedArray(value)
// ✅ ArrayBuffer.isView(value) && !(value instanceof DataView)
```
