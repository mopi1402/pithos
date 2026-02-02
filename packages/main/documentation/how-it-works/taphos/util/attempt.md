Attempts to invoke func, returning either the result or the error.
**Deprecated**: Use try-catch directly.
```mermaid
flowchart TD
    A["attempt(fn)"] --> B{"fn throws?"}
    B -->|Yes| C["Error"]
    B -->|No| D["Result"]
```

### Native Equivalent

```typescript
// ❌ attempt(fn)
// ✅ try { fn() } catch (e) { return e }
```
