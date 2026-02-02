## `isNonNull`

### **Ensure** value existence

@keywords: ensure, existence, non-null, validation, semantic, strict

Strictly check that a value is not `null` (allows `undefined`).
Useful when `null` has a specific semantic meaning different from `undefined`.

```typescript
if (isNonNull(value)) {
  // value is T | undefined, but not null
}
```
