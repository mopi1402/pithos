## `countBy`

### **Count items** by status/category 📍

@keywords: count, status, category, occurrences, analytics, dashboard

Count occurrences of each status or category in a collection.
Essential for dashboards, admin panels, and e-commerce analytics.

```typescript
const orders = [
  { id: 1, status: "pending" },
  { id: 2, status: "shipped" },
  { id: 3, status: "pending" },
];

countBy(orders, (order) => order.status);
// => { pending: 2, shipped: 1 }
```

### **Count occurrences** in simple arrays

@keywords: count, frequency, occurrences, survey, poll, analysis

Count frequency of each value in a flat array.
Useful for surveys, polls, and frequency analysis.

```typescript
const responses = ["yes", "no", "yes", "yes", "no"];

countBy(responses, (r) => r);
// => { yes: 3, no: 2 }
```

### **Count by** computed key

@keywords: count, computed, derived, calculated, grouping, segmentation

Count items grouped by a derived or calculated value.
Useful for segmentation and conditional grouping.

```typescript
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 32 },
];

countBy(users, (user) => (user.age >= 18 ? "adult" : "minor"));
// => { adult: 2, minor: 1 }
```
