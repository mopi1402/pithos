## `evolve` 💎

> A distinctively declarative way to transform object properties using functions.

### **Transform** specific fields 📍

@keywords: transform, fields, declarative, normalization, API, mapping

Apply different transformation functions to specific keys in an object.
Perfect for normalizing data from API responses.

```typescript
const user = evolve(apiResponse, {
  name: (s) => s.trim(),
  age: (n) => Number(n),
});
```

### **Apply** nested transformations

@keywords: apply, nested, transformations, deep, state, declarative

Declaratively transform deeply nested properties.
Essential for modifying complex state trees.

```typescript
const state = evolve(appState, {
  settings: {
    theme: (t) => t.toLowerCase(),
    notifications: (n) => !n // Toggle boolean
  }
});
```

### **Sanitize** data conditionally

@keywords: sanitize, cleaning, conditional, validation, pipeline, data

Apply transformation logic that adapts to values.
Useful for data cleaning pipelines.

```typescript
const cleaned = evolve(data, {
  score: (n) => (n < 0 ? 0 : n), // Clamp to 0
  tags: (arr) => arr.filter(t => t.length > 0) // Remove empty tags
});
```
