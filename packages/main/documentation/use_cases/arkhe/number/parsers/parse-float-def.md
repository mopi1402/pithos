## `parseFloatDef` ⭐

### **Handle** optional floating-point inputs 📍

@keywords: handle, optional, float, nullable, query-params, API

Parse a float from potentially null or undefined inputs safely.
Perfect for optional query parameters or partial API responses.

```typescript
// queryParam might be null, undefined, or string
const height = parseFloatDef(queryParam, 1.0);
```

### **Set** defaults for missing data

@keywords: defaults, missing, normalization, empty, fallback, parsing

Provide sensible defaults when parsing possibly empty strings.
Useful for data normalization pipelines.

```typescript
const value = parseFloatDef("", 0.0); // Returns 0.0
```
