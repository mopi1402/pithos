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
