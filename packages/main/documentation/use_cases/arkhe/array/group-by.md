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

