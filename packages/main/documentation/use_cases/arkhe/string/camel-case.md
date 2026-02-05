## `camelCase` ⭐

### **Normalize** keys 📍

@keywords: normalize, keys, camelCase, identifiers, API, properties

Convert property names or identifiers to standard JavaScript `camelCase`.
Essential for API response normalization and consistent coding style.

```typescript
const key = camelCase('user-id'); // 'userId'
const prop = camelCase('first_name'); // 'firstName'
```

### **Ensure** identifier safety

@keywords: ensure, identifier, safety, variables, code-generation, valid

Ensure a string is a valid variable identifier.
Useful when generating code or dynamic property accessors.

```typescript
const varName = camelCase('My Class Name'); // 'myClassName'
```

### **Convert** API response keys from snake_case

@keywords: convert, API, response, snake_case, camelCase, keys, normalize, backend

Transform snake_case keys from a backend API into JavaScript-standard camelCase.
The most common real-world use case, especially with Python/Ruby/Go backends.

```typescript
const apiResponse = {
  user_id: 42,
  first_name: "Alice",
  created_at: "2025-01-15",
  is_active: true,
};

// Combined with mapKeys for full object transformation
const normalized = mapKeys(apiResponse, (_, key) => camelCase(key));
// => { userId: 42, firstName: "Alice", createdAt: "2025-01-15", isActive: true }
```
