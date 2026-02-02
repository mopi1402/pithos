Invokes interceptor and returns the value.
**Deprecated**: Use inline function or console.log directly.
```mermaid
flowchart LR
    A["value"] --> B["tap(_, fn)"]
    B --> C["fn(value)"]
    C --> D["returns value"]
```

### Native Equivalent

```typescript
// ❌ tap(value, console.log)
// ✅ (console.log(value), value)
```
