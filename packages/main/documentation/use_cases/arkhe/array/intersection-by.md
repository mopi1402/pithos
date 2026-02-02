## `intersectionBy`

### **Find common users** across multiple platforms by ID 📍

@keywords: find, common, users, platforms, cross-platform, deduplication

Identify users present in multiple systems using a unique identifier.
Perfect for cross-platform analytics, user deduplication, or data merging.

```typescript
const platformA = [
  { id: 1, name: "Alice", joinedAt: "2023-01" },
  { id: 2, name: "Bob", joinedAt: "2023-02" },
  { id: 3, name: "Charlie", joinedAt: "2023-03" },
];

const platformB = [
  { id: 2, name: "Robert", joinedAt: "2022-05" },
  { id: 3, name: "Charles", joinedAt: "2022-06" },
  { id: 4, name: "Diana", joinedAt: "2022-07" },
];

const platformC = [
  { id: 3, name: "Charlie C.", joinedAt: "2021-01" },
  { id: 5, name: "Eve", joinedAt: "2021-02" },
  { id: 2, name: "Bobby", joinedAt: "2021-03" },
];

const commonUsers = intersectionBy([platformA, platformB, platformC], "id");
// => [
//   { id: 2, name: "Bob", joinedAt: "2023-02" },
//   { id: 3, name: "Charlie", joinedAt: "2023-03" }
// ]
```

### **Match products** across inventories by SKU

@keywords: match, products, inventory, SKU, warehouse, stock

Find products available in all warehouses or stores for fulfillment.
Ideal for inventory management, multi-location stock checks, or supply chain.

```typescript
const warehouse1 = [
  { sku: "KB-001", name: "Mechanical Keyboard", stock: 50 },
  { sku: "MS-002", name: "Gaming Mouse", stock: 30 },
  { sku: "HD-003", name: "Headset Pro", stock: 20 },
];

const warehouse2 = [
  { sku: "MS-002", name: "Gaming Mouse", stock: 45 },
  { sku: "HD-003", name: "Headset Pro", stock: 15 },
  { sku: "MT-004", name: 'Monitor 27"', stock: 10 },
];

const warehouse3 = [
  { sku: "HD-003", name: "Headset Pro", stock: 25 },
  { sku: "MS-002", name: "Gaming Mouse", stock: 60 },
  { sku: "WC-005", name: "Webcam HD", stock: 40 },
];

const availableEverywhere = intersectionBy(
  [warehouse1, warehouse2, warehouse3],
  (product) => product.sku
);
// => [
//   { sku: "MS-002", name: "Gaming Mouse", stock: 30 },
//   { sku: "HD-003", name: "Headset Pro", stock: 20 }
// ]
```

### **Find overlapping events** by date across calendars

@keywords: find, overlapping, events, calendar, scheduling, conflict

Identify days with events in multiple calendars for conflict detection.
Useful for scheduling apps, availability checks, or team coordination.

```typescript
const aliceCalendar = [
  { date: "2024-01-15", event: "Team Meeting", priority: "high" },
  { date: "2024-01-16", event: "Code Review", priority: "medium" },
  { date: "2024-01-17", event: "Sprint Planning", priority: "high" },
];

const bobCalendar = [
  { date: "2024-01-15", event: "Client Call", priority: "high" },
  { date: "2024-01-17", event: "Workshop", priority: "low" },
  { date: "2024-01-18", event: "Demo", priority: "high" },
];

const busyDays = intersectionBy([aliceCalendar, bobCalendar], "date");
// => [
//   { date: "2024-01-15", event: "Team Meeting", priority: "high" },
//   { date: "2024-01-17", event: "Sprint Planning", priority: "high" }
// ]
```
