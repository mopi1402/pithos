## `isArray`

### **Validate** list structures 📍

@keywords: validate, array, list, type-check, guard, iteration

Ensure a value is an array before iterating or mapping.
Essential for processing API responses that might return single objects or arrays.

```typescript
if (isArray(data)) {
  data.forEach(item => process(item));
}
```

### **Normalize** API responses 📍

@keywords: normalize, API, responses, inconsistent, format, handling

Handle endpoints that return either a single item or an array.
Essential for APIs with inconsistent response formats.
```typescript
const users = isArray(response.data) 
  ? response.data 
  : [response.data];

// Now always an array
users.forEach(user => processUser(user));
```

### **Type narrowing** in conditionals

@keywords: narrowing, TypeScript, conditionals, safety, types, inference

Safely access array methods after type check.
```typescript
function getFirst<T>(value: T | T[]): T | undefined {
  if (isArray(value)) {
    return value[0]; // TypeScript knows it's T[]
  }
  return value;
}
```
