Defers invoking func until the current call stack clears.
**Deprecated**: Use `setTimeout(fn, 0)` or `queueMicrotask()` directly.
```mermaid
flowchart LR
    A["defer(fn)"] --> B["setTimeout(fn, 0)"]
```

### Native Equivalent

```typescript
// ❌ defer(fn)
// ✅ setTimeout(fn, 0)
// ✅ queueMicrotask(fn)
```
