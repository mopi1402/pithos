Creates a duplicate-free version of an array.
**Deprecated**: Use `[...new Set(array)]` directly (ES2015).
```mermaid
flowchart LR
    A["[1, 2, 2, 3, 3, 3]"] --> B["uniq(_)"]
    B --> C["[1, 2, 3]"]
```

### Native Equivalent

```typescript
// ❌ uniq(arr)
// ✅ [...new Set(arr)]
// ✅ Array.from(new Set(arr))
```
