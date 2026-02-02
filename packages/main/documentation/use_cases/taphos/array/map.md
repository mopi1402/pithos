## `map`

### **Transform** array elements 📍

@keywords: transform, map, convert, array

Apply a function to each element.

```typescript
const numbers = [1, 2, 3, 4];
numbers.map(n => n * 2);
// => [2, 4, 6, 8]
```

### **Extract** property values

@keywords: extract, property, values, pluck

Get a specific property from each object.

```typescript
const users = [{ name: "Alice" }, { name: "Bob" }];
users.map(u => u.name);
// => ["Alice", "Bob"]
```

### **Convert** data format

@keywords: convert, format, transform, normalize

Transform data into a different structure.

```typescript
const items = [{ id: 1, value: "a" }, { id: 2, value: "b" }];
items.map(({ id, value }) => ({ key: id, data: value }));
```
