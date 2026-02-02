## `set`

### **Update** nested data safely 📍

@keywords: update, nested, immutable, path, deep, reducer

Set a value at a deep path, creating intermediate objects if missing. Returns a new object (immutable).
Essential for reducer-like state updates.

```typescript
const updatedState = set(state, 'users[0].isActive', true);
```

### **Create** deep structures

@keywords: create, deep, structures, nested, builder, conversion

Build a deeply nested object from scratch by setting a single path on an empty object.
Useful for converting flat keys to nested objects.

```typescript
const obj = set({}, 'a.b.c', 'value');
// { a: { b: { c: 'value' } } }
```

### **Append** to arrays

@keywords: append, arrays, indices, elements, path, update

Use numeric indices in the path to create or update array elements.

```typescript
const list = set([], '[0].name', 'First');
// [{ name: 'First' }]
```
