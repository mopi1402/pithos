## `minBy`

### **Find the cheapest product** 📍

@keywords: find, cheapest, minimum, lowest, price, budget

Identify the lowest-priced item for discounts or budget analysis.
Perfect for e-commerce, price comparison, or deal finders.

```typescript
const cartItems = [
  { name: "Headphones", price: 149.99 },
  { name: "USB Cable", price: 12.99 },
  { name: "Mouse Pad", price: 9.99 },
];

const cheapest = minBy(cartItems, (item) => item.price);
// => { name: "Mouse Pad", price: 9.99 }
```

### **Get the nearest location**

@keywords: get, nearest, closest, location, distance, proximity

Find the closest point by distance calculation.
Ideal for location services, delivery apps, or proximity searches.

```typescript
const userPos = { lat: 48.8566, lng: 2.3522 };

const stores = [
  { name: "Store A", lat: 48.8698, lng: 2.3076 },
  { name: "Store B", lat: 48.8566, lng: 2.3629 },
  { name: "Store C", lat: 48.8867, lng: 2.3431 },
];

const nearest = minBy(stores, (s) =>
  Math.hypot(s.lat - userPos.lat, s.lng - userPos.lng)
);
// => { name: "Store B", ... }
```

### **Find the oldest pending task**

@keywords: find, oldest, pending, task, queue, scheduling

Identify tasks waiting the longest to prevent queue starvation.
Useful for task management, ticketing, or job schedulers.

```typescript
const tasks = [
  { id: "T1", title: "Fix bug", createdAt: new Date("2024-01-15") },
  { id: "T2", title: "Update docs", createdAt: new Date("2024-01-18") },
  { id: "T3", title: "Add feature", createdAt: new Date("2024-01-10") },
];

const oldest = minBy(tasks, (t) => t.createdAt.getTime());
// => { id: "T3", title: "Add feature", createdAt: Date("2024-01-10") }
```
