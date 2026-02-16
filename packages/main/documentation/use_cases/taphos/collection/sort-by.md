## `sortBy` ⭐

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

### **Sort** with multiple criteria

@keywords: sort, multiple, criteria, secondary, tiebreaker, files, name, date

Sort by a primary key and break ties with a secondary key.
Very common for file explorers, task lists, and any sortable table.

```typescript
const files = [
  { name: "readme.md", modified: new Date("2025-06-01") },
  { name: "index.ts", modified: new Date("2025-06-10") },
  { name: "readme.md", modified: new Date("2025-05-15") },
  { name: "config.json", modified: new Date("2025-06-10") },
];

const sorted = sortBy(files, [(f) => f.name, (f) => -f.modified.getTime()]);
// => config.json (Jun 10), index.ts (Jun 10), readme.md (Jun 1), readme.md (May 15)
// Same name → most recent first
```
