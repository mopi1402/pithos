## `zipObject` 💎

> A concise way to create typed objects from parallel key-value arrays.

### **Create** object from arrays 📍

@keywords: zip, object, keys, values

Create an object from arrays of keys and values.

```typescript
const keys = ["a", "b", "c"];
const values = [1, 2, 3];
Object.fromEntries(keys.map((k, i) => [k, values[i]]));
// => { a: 1, b: 2, c: 3 }
```

### **Map** fields to values

@keywords: map, fields, values, form

Build an object from parallel arrays.

```typescript
const fields = ["name", "email", "age"];
const data = ["Alice", "alice@example.com", 30];
Object.fromEntries(fields.map((f, i) => [f, data[i]]));
// => { name: "Alice", email: "alice@example.com", age: 30 }
```

### **Combine** headers with row

@keywords: combine, headers, row, CSV

Create object from CSV header and data row.

```typescript
const headers = ["id", "title", "price"];
const row = [1, "Product", 99.99];
Object.fromEntries(headers.map((h, i) => [h, row[i]]));
```
