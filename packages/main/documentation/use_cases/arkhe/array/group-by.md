## `groupBy` ⭐

### **Group users by role** 📍

@keywords: group, users, role, organize, permission, category

Organize a list of users based on their role or permission.
Perfect for admin dashboards, access management, or category-based displays.

```typescript
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" },
  { name: "Diana", role: "guest" },
];

const usersByRole = groupBy(users, (u) => u.role);
// => {
//   admin: [{ name: "Alice", role: "admin" }, { name: "Charlie", role: "admin" }],
//   user: [{ name: "Bob", role: "user" }],
//   guest: [{ name: "Diana", role: "guest" }]
// }
```

### **Group products by category** 📍

@keywords: group, products, category, classify, ecommerce, inventory

Classify items or products by their category for organized display.
Perfect for e-commerce, catalogs, or inventory systems.

```typescript
const products = [
  { name: "iPhone", category: "electronics" },
  { name: "T-Shirt", category: "clothing" },
  { name: "MacBook", category: "electronics" },
  { name: "Jeans", category: "clothing" },
];

const productsByCategory = groupBy(products, (p) => p.category);
// => {
//   electronics: [{ name: "iPhone", ... }, { name: "MacBook", ... }],
//   clothing: [{ name: "T-Shirt", ... }, { name: "Jeans", ... }]
// }
```

### **Group events by date** or period

@keywords: group, events, date, period, calendar, logs, reports

Organize events, logs, or transactions by day/month/year.
Perfect for calendars, history logs, or time-based reports.

```typescript
const events = [
  { title: "Meeting", date: "2025-12-19" },
  { title: "Lunch", date: "2025-12-19" },
  { title: "Conference", date: "2025-12-20" },
  { title: "Workshop", date: "2025-12-21" },
];

const eventsByDate = groupBy(events, (e) => e.date);
// => {
//   "2025-12-19": [{ title: "Meeting", ... }, { title: "Lunch", ... }],
//   "2025-12-20": [{ title: "Conference", ... }],
//   "2025-12-21": [{ title: "Workshop", ... }]
// }
```

### **Group patients** by department or blood type

@keywords: patients, medical, hospital, department, blood type, healthcare, triage

Organize patient records by department for efficient hospital management.
Essential for healthcare systems, triage optimization, and medical analytics.

```typescript
const patients = [
  { id: "P001", name: "Jean Dupont", department: "cardiology", bloodType: "A+" },
  { id: "P002", name: "Marie Martin", department: "neurology", bloodType: "O-" },
  { id: "P003", name: "Pierre Bernard", department: "cardiology", bloodType: "B+" },
  { id: "P004", name: "Sophie Petit", department: "oncology", bloodType: "A+" },
  { id: "P005", name: "Luc Moreau", department: "neurology", bloodType: "AB+" },
];

// Group by department for ward management
const byDepartment = groupBy(patients, (p) => p.department);
// => {
//   cardiology: [P001, P003],
//   neurology: [P002, P005],
//   oncology: [P004]
// }

// Group by blood type for transfusion planning
const byBloodType = groupBy(patients, (p) => p.bloodType);
// => { "A+": [P001, P004], "O-": [P002], "B+": [P003], "AB+": [P005] }
```


### **Group logs by severity** for monitoring dashboards

@keywords: logs, severity, monitoring, observability, error, warn, info, debug

Organize application logs by severity level for quick triage.
Essential for monitoring dashboards, alerting systems, and incident response.

```typescript
const logs = [
  { message: "User login successful", level: "info", timestamp: 1703001200 },
  { message: "Database connection timeout", level: "error", timestamp: 1703001250 },
  { message: "Deprecated API endpoint used", level: "warn", timestamp: 1703001300 },
  { message: "Cache miss for key user:42", level: "info", timestamp: 1703001350 },
  { message: "Unhandled promise rejection", level: "error", timestamp: 1703001400 },
];

const logsBySeverity = groupBy(logs, (log) => log.level);
// => {
//   info: [{ message: "User login successful", ... }, { message: "Cache miss...", ... }],
//   error: [{ message: "Database connection timeout", ... }, { message: "Unhandled...", ... }],
//   warn: [{ message: "Deprecated API endpoint used", ... }]
// }

// Quick error count for alerting
const errorCount = logsBySeverity.error?.length ?? 0;
```

### **Group orders by status** for e-commerce pipelines

@keywords: orders, status, ecommerce, pipeline, fulfillment, tracking, shipping

Organize orders by fulfillment status for warehouse and logistics management.
Critical for e-commerce platforms, order tracking, and operational dashboards.

```typescript
const orders = [
  { id: "ORD-001", customer: "Alice", status: "shipped", total: 89.99 },
  { id: "ORD-002", customer: "Bob", status: "pending", total: 149.50 },
  { id: "ORD-003", customer: "Charlie", status: "delivered", total: 34.00 },
  { id: "ORD-004", customer: "Diana", status: "pending", total: 220.00 },
  { id: "ORD-005", customer: "Eve", status: "shipped", total: 75.00 },
];

const ordersByStatus = groupBy(orders, (o) => o.status);
// => {
//   shipped: [ORD-001, ORD-005],
//   pending: [ORD-002, ORD-004],
//   delivered: [ORD-003]
// }

// Calculate revenue pending fulfillment
const pendingRevenue = ordersByStatus.pending?.reduce((sum, o) => sum + o.total, 0) ?? 0;
// => 369.50
```
