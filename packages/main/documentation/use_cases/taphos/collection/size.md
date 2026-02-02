## `size`

### **Get** collection length 📍

@keywords: size, length, count, collection

Get the number of elements in a collection.

```typescript
const items = [1, 2, 3, 4, 5];
items.length;
// => 5
```

### **Count** object properties

@keywords: count, object, properties, keys

Get the number of properties in an object.

```typescript
const config = { host: "localhost", port: 3000, debug: true };
Object.keys(config).length;
// => 3
```

### **Check** if empty

@keywords: check, empty, length, validation

Determine if a collection is empty.

```typescript
const results = [];
results.length === 0;
// => true
```
