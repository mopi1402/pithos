## `maxBy`

### **Find the highest-earning employee** 📍

@keywords: find, highest, maximum, top, leaderboard, analytics, huge dataset, charts

Identify top performers by a numeric field.
Perfect for HR analytics, leaderboards, or compensation reports.

```typescript
const employees = [
  { name: "Alice", salary: 95000 },
  { name: "Bob", salary: 78000 },
  { name: "Charlie", salary: 120000 },
];

const highestPaid = maxBy(employees, (e) => e.salary);
// => { name: "Charlie", salary: 120000 }
```

### **Get the most recent entry**

@keywords: get, recent, latest, timestamp, date, activity

Find the latest item based on timestamp or date.
Ideal for activity feeds, audit logs, or "last updated" features.

```typescript
const orders = [
  { id: "ORD-001", createdAt: new Date("2024-01-10") },
  { id: "ORD-002", createdAt: new Date("2024-01-15") },
  { id: "ORD-003", createdAt: new Date("2024-01-12") },
];

const mostRecent = maxBy(orders, (o) => o.createdAt.getTime());
// => { id: "ORD-002", createdAt: Date("2024-01-15") }
```

### **Select the best-rated product**

@keywords: select, best, rated, rating, recommendation, reviews

Find top-rated items for recommendations or featured sections.
Useful for e-commerce, reviews, or content curation.

```typescript
const products = [
  { name: "ProBook", rating: 4.5 },
  { name: "UltraSlim", rating: 4.8 },
  { name: "GameMaster", rating: 4.6 },
];

const topRated = maxBy(products, (p) => p.rating);
// => { name: "UltraSlim", rating: 4.8 }
```

### **Find** the most engaged user for analytics

@keywords: engaged, user, analytics, metrics, dashboard, observability, charts

Identify the user with the highest engagement score.
Essential for analytics dashboards and user segmentation.

```typescript
const users = [
  { id: "u1", name: "Alice", sessions: 45, pageViews: 320 },
  { id: "u2", name: "Bob", sessions: 12, pageViews: 85 },
  { id: "u3", name: "Charlie", sessions: 67, pageViews: 510 },
];

const mostEngaged = maxBy(users, (u) => u.pageViews);
// => { id: "u3", name: "Charlie", sessions: 67, pageViews: 510 }
```

### **Find** the heaviest bundle for optimization

@keywords: bundle, heaviest, size, optimization, performance, loading, scripts

Identify the largest bundle chunk for code-splitting opportunities.
Critical for build optimization and performance audits.

```typescript
const bundles = [
  { name: "vendor.js", size: 245000, gzip: 78000 },
  { name: "app.js", size: 189000, gzip: 52000 },
  { name: "charts.js", size: 312000, gzip: 95000 },
];

const heaviest = maxBy(bundles, (b) => b.gzip);
// => { name: "charts.js", size: 312000, gzip: 95000 }
console.log(`Consider code-splitting: ${heaviest?.name}`);
```
