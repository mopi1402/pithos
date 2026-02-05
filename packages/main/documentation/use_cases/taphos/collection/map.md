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

### **Format** data for display

@keywords: format, display, dates, currency, names, UI, rendering

Transform raw data into human-readable strings for UI rendering.
The most common real-world use of map in frontend applications.

```typescript
const transactions = [
  { amount: 1299, currency: "USD", date: "2025-06-15T10:30:00Z" },
  { amount: 4599, currency: "EUR", date: "2025-06-14T08:00:00Z" },
];

const formatted = map(transactions, (t) => ({
  display: `${(t.amount / 100).toFixed(2)} ${t.currency}`,
  date: new Date(t.date).toLocaleDateString("fr-FR"),
}));
// => [{ display: "12.99 USD", date: "15/06/2025" }, { display: "45.99 EUR", date: "14/06/2025" }]
```
