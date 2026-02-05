## `filter` ⭐

### **Extract** matching items 📍

@keywords: extract, filter, matching, criteria, search

Filter elements that match specific criteria.

```typescript
const products = [{ category: "electronics" }, { category: "clothing" }];
products.filter(p => p.category === "electronics");
```

### **Filter** active flags from object

@keywords: filter, features, flags, enabled

Extract enabled flags from a configuration object.

```typescript
const flags = { darkMode: true, beta: false, analytics: true };
Object.fromEntries(
  Object.entries(flags).filter(([, enabled]) => enabled)
);
// => { darkMode: true, analytics: true }
```

### **Select** high-priority items

@keywords: select, priority, filtering, urgent

Filter items by priority level.

```typescript
const notifications = [{ priority: "high" }, { priority: "low" }];
notifications.filter(n => n.priority === "high");
```

### **Filter** events by date range for analytics

@keywords: filter, date, range, analytics, dashboard, logs, events

Select events within a specific time window for reporting.
Essential for analytics dashboards, audit logs, and time-series data.

```typescript
const startDate = new Date("2025-01-01");
const endDate = new Date("2025-01-31");

const events = [
  { type: "purchase", date: new Date("2025-01-15"), amount: 99 },
  { type: "purchase", date: new Date("2025-02-10"), amount: 49 },
  { type: "refund", date: new Date("2025-01-20"), amount: 30 },
];

const januaryEvents = filter(events, (e) => e.date >= startDate && e.date <= endDate);
// => [{ type: "purchase", date: Jan 15, ... }, { type: "refund", date: Jan 20, ... }]
```

### **Filter** search results with multiple criteria

@keywords: filter, search, criteria, multiple, ecommerce, catalog, faceted

Apply combined filters on a product catalog or search results.
Critical for e-commerce search, job boards, and any faceted filtering UI.

```typescript
const products = [
  { name: "Laptop", price: 1200, category: "electronics", inStock: true },
  { name: "T-Shirt", price: 25, category: "clothing", inStock: true },
  { name: "Monitor", price: 400, category: "electronics", inStock: false },
  { name: "Keyboard", price: 80, category: "electronics", inStock: true },
];

const activeFilters = { category: "electronics", maxPrice: 500, inStock: true };

const results = filter(products, (p) =>
  p.category === activeFilters.category &&
  p.price <= activeFilters.maxPrice &&
  p.inStock === activeFilters.inStock
);
// => [{ name: "Keyboard", price: 80, ... }]
```
