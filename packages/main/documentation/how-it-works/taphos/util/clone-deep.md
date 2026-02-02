Creates a deep clone of a value.
**Deprecated**: Use `structuredClone()` directly (ES2022) or Arkhe's `deepClone`.
```mermaid
flowchart LR
    A["{ a: { b: 1 } }"] --> B["cloneDeep(_)"]
    B --> C["{ a: { b: 1 } } (new ref)"]
```

### Native Equivalent

```typescript
// ❌ cloneDeep(obj)
// ✅ structuredClone(obj)
// ✅ deepClone(obj)  // Arkhe
```
