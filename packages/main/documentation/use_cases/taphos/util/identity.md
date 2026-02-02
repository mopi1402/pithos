## `identity`

### **Pass-through** function 📍

@keywords: identity, passthrough, noop, function

Return value unchanged.

```typescript
const fn = (x: T) => x;
// Or for filtering truthy:
[1, 0, 2, null].filter(Boolean);  // [1, 2]
```

### **Default** transformer

@keywords: default, transformer, callback, optional

Use as default when no transform needed.

```typescript
function process<T>(items: T[], transform = (x: T) => x) {
  return items.map(transform);
}
```
