## `reduce`

### **Aggregate** values into single result 📍

@keywords: reduce, aggregate, sum, accumulate

Combine all elements into a single value.

```typescript
const prices = [10, 20, 30, 40];
prices.reduce((sum, price) => sum + price, 0);
// => 100
```

### **Group** items by key

@keywords: group, items, key, categorize

Categorize items into groups.

```typescript
const items = [{ type: "a" }, { type: "b" }, { type: "a" }];
items.reduce((acc, item) => {
  (acc[item.type] ??= []).push(item);
  return acc;
}, {});
```

### **Build** lookup map

@keywords: build, lookup, map, index

Create an object for fast lookups.

```typescript
const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
users.reduce((map, u) => ({ ...map, [u.id]: u }), {});
// => { 1: { id: 1, ... }, 2: { id: 2, ... } }
```

### **Compute** multiple statistics in a single pass

@keywords: statistics, aggregate, average, min, max, count, analytics, dataset

Calculate several metrics (sum, count, min, max) without iterating multiple times.
Efficient for analytics, reporting, and data processing pipelines.

```typescript
const orders = [
  { amount: 120 },
  { amount: 45 },
  { amount: 230 },
  { amount: 89 },
];

const stats = reduce(
  orders,
  (acc, order) => ({
    total: acc.total + order.amount,
    count: acc.count + 1,
    min: Math.min(acc.min, order.amount),
    max: Math.max(acc.max, order.amount),
  }),
  { total: 0, count: 0, min: Infinity, max: -Infinity }
);

const average = stats.total / stats.count;
// stats => { total: 484, count: 4, min: 45, max: 230 }
// average => 121
```
