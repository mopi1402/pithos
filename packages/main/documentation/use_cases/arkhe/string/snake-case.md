## `snakeCase`

### **Format** database columns 📍

@keywords: format, database, columns, snake_case, Python, backend

Convert strings to `snake_case` for database column names or Python API compatibility.
Critical for backend integration.

```typescript
const column = snakeCase('userId'); // 'user_id'
```

### **Convert** payload keys before sending to a Python/Ruby API

@keywords: convert, payload, keys, camelCase, snake_case, API, Python, Ruby, backend

Transform camelCase JavaScript keys into snake_case before sending to a backend API.
The reverse of the camelCase normalization — essential for full-stack interop.

```typescript
const payload = {
  userId: 42,
  firstName: "Alice",
  isActive: true,
};

// Combined with mapKeys for full object transformation
const apiPayload = mapKeys(payload, (_, key) => snakeCase(key));
// => { user_id: 42, first_name: "Alice", is_active: true }

await fetch("/api/users", {
  method: "POST",
  body: JSON.stringify(apiPayload),
});
```
