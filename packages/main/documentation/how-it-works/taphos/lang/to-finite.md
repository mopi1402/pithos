Converts value to a finite number.
**Deprecated**: Use combination of `Number()` and bounds check.
```mermaid
flowchart TD
    A["toFinite(value)"] --> B{"Is Infinity?"}
    B -->|Yes| C["MAX_VALUE or -MAX_VALUE"]
    B -->|No| D["Number(value)"]
```

### Native Equivalent

```typescript
// ❌ toFinite(value)
// ✅ Math.max(-Number.MAX_VALUE, Math.min(Number.MAX_VALUE, Number(value)))
```
