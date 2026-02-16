## `keys` / `values` / `toPairs` ⭐

### **Get** object keys 📍

@keywords: keys, properties, names, object

Get all property names.

```typescript
Object.keys(obj);     // => ["a", "b", "c"]
Object.values(obj);   // => [1, 2, 3]
Object.entries(obj);  // => [["a", 1], ["b", 2], ["c", 3]]
```

### **Iterate** properties

@keywords: iterate, properties, entries, loop

Loop over object properties.

```typescript
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

### **Transform** object

@keywords: transform, map, entries, convert

Transform using entries.

```typescript
Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
```

### **Count** object properties for validation

@keywords: count, properties, size, validation, payload, limit, API

Check the number of properties in an object to enforce limits.
Useful for API payload validation, configuration checks, and form field counting.

```typescript
const payload = { name: "Alice", email: "alice@example.com", role: "admin" };

const fieldCount = keys(payload).length;
// => 3

if (fieldCount > 50) {
  throw new Error("Payload too large: max 50 fields allowed");
}
```
