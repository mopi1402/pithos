## `sortBy`

### **Sort** objects by property 📍

@keywords: sort, property, order, arrange

Sort an array of objects by a specific property.

```typescript
const users = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
users.toSorted((a, b) => a.name.localeCompare(b.name));
// => [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]
```

### **Order** by numeric value

@keywords: order, numeric, value, ascending

Sort items by a numeric property.

```typescript
const products = [{ price: 30 }, { price: 10 }, { price: 20 }];
products.toSorted((a, b) => a.price - b.price);
// => [{ price: 10 }, { price: 20 }, { price: 30 }]
```

### **Sort** by date

@keywords: sort, date, chronological, time

Order items chronologically.

```typescript
const events = [{ date: new Date("2024-03") }, { date: new Date("2024-01") }];
events.toSorted((a, b) => a.date - b.date);
```
