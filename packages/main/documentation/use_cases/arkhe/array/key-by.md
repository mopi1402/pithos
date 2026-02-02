## `keyBy` ⭐

### **Create lookup tables** for instant access by ID 📍

@keywords: lookup, table, index, cache, normalize, instant

Transform an array into an object indexed by unique identifier.
Perfect for normalizing API responses, caching entities, or quick O(1) lookups.

```typescript
const users = [
  { id: "u1", name: "Alice", role: "admin" },
  { id: "u2", name: "Bob", role: "user" },
  { id: "u3", name: "Charlie", role: "user" },
];

const usersById = keyBy(users, (u) => u.id);
// => {
//   u1: { id: "u1", name: "Alice", role: "admin" },
//   u2: { id: "u2", name: "Bob", role: "user" },
//   u3: { id: "u3", name: "Charlie", role: "user" }
// }

const alice = usersById["u1"];
// => { id: "u1", name: "Alice", role: "admin" }
```

### **Index configuration objects** by key property 📍

@keywords: index, configuration, settings, flags, retrieval, mapping

Map settings or config items for quick retrieval by name or code.
Ideal for feature flags, locale settings, or environment configurations.

```typescript
const features = [
  { code: "DARK_MODE", enabled: true, description: "Enable dark theme" },
  { code: "BETA_UI", enabled: false, description: "New UI experiment" },
  { code: "ANALYTICS", enabled: true, description: "Track user events" },
];

const featureFlags = keyBy(features, (f) => f.code);
// => {
//   DARK_MODE: { code: "DARK_MODE", enabled: true, ... },
//   BETA_UI: { code: "BETA_UI", enabled: false, ... },
//   ANALYTICS: { code: "ANALYTICS", enabled: true, ... }
// }

if (featureFlags["DARK_MODE"]?.enabled) {
  applyDarkTheme();
}
```

### **Map relational data** for join-like operations

@keywords: map, relational, join, merge, denormalize, relationships

Index related entities to efficiently merge data from multiple sources.
Useful for combining API responses, denormalizing data, or building relationships.

```typescript
const orders = [
  { orderId: 1, productId: "p1", quantity: 2 },
  { orderId: 2, productId: "p3", quantity: 1 },
  { orderId: 3, productId: "p2", quantity: 5 },
];

const products = [
  { sku: "p1", name: "Keyboard", price: 79 },
  { sku: "p2", name: "Mouse", price: 29 },
  { sku: "p3", name: "Monitor", price: 299 },
];

const productsBySku = keyBy(products, (p) => p.sku);

const enrichedOrders = orders.map((order) => ({
  ...order,
  product: productsBySku[order.productId],
  total: (productsBySku[order.productId]?.price ?? 0) * order.quantity,
}));
```
