## `map`

### **Transform** collection elements 📍

@keywords: transform, map, convert, array

Apply a function to each element.

```typescript
const users = [{ name: "Alice" }, { name: "Bob" }];
users.map(u => u.name.toUpperCase());
// => ["ALICE", "BOB"]
```

### **Convert** object values

@keywords: convert, object, values, transform

Transform all values in an object.

```typescript
const prices = { apple: 1.5, banana: 0.75 };
Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 1.1])
);
// => { apple: 1.65, banana: 0.825 }
```

### **Extract** property values

@keywords: extract, property, pluck, values

Get a specific property from each object.

```typescript
const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
items.map(item => item.id);
// => [1, 2, 3]
```
