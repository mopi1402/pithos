## `unionBy`

### **Merge user lists** from multiple sources 📍

@keywords: merge, union, unique by ID, CRM, data sync

Combine users from different systems while keeping unique entries by ID.
Perfect for CRM integrations, data migrations, or user syncing.

```typescript
const crmUsers = [
  { id: 1, name: "Alice", source: "crm" },
  { id: 2, name: "Bob", source: "crm" },
];

const marketingUsers = [
  { id: 2, name: "Bob M.", source: "marketing" },
  { id: 3, name: "Charlie", source: "marketing" },
];

const allUsers = unionBy([crmUsers, marketingUsers], (u) => u.id);
// => [Alice, Bob (from CRM), Charlie]
```

### **Consolidate product catalogs** by SKU

@keywords: catalog, SKU, inventory, suppliers, deduplication

Merge inventory from different suppliers without duplicates.
Ideal for marketplaces, inventory management, or price aggregators.

```typescript
const vendorA = [
  { sku: "LAPTOP-001", name: "Pro Laptop", price: 1299 },
  { sku: "MOUSE-001", name: "Wireless Mouse", price: 49 },
];

const vendorB = [
  { sku: "MOUSE-001", name: "Mouse Pro", price: 45 },
  { sku: "MONITOR-001", name: "4K Monitor", price: 399 },
];

const catalog = unionBy([vendorA, vendorB], (p) => p.sku);
// => [LAPTOP-001, MOUSE-001 (from A), MONITOR-001]
```

### **Aggregate events** from multiple calendars

@keywords: calendar, events, aggregate, unique ID, scheduling

Combine schedules avoiding duplicate meetings by unique ID.
Useful for calendar apps or availability checkers.

```typescript
const workCalendar = [
  { uid: "evt-001", title: "Team Standup" },
  { uid: "evt-002", title: "Project Review" },
];

const personalCalendar = [
  { uid: "evt-001", title: "Standup (synced)" },
  { uid: "evt-003", title: "Gym Session" },
];

const allEvents = unionBy([workCalendar, personalCalendar], (e) => e.uid);
// => [evt-001 (work version), evt-002, evt-003]
```
