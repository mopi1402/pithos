## `groupBy` ⭐

### **Group users by role** 📍

@keywords: group, users, role, organize, permission, category, huge dataset

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

@keywords: group, products, category, classify, ecommerce, inventory, huge dataset

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

@keywords: group, events, date, period, calendar, logs, reports, charts

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

@keywords: logs, severity, monitoring, observability, error, warn, info, debug, scripts

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

@keywords: orders, status, ecommerce, pipeline, fulfillment, tracking, shipping, payment

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

### **Group** chart data by time period

@keywords: chart, time, period, aggregation, visualization, charts, dashboard

Aggregate data points by hour, day, or month for chart rendering.
Essential for time-series charts and analytics dashboards.

```typescript
const pageViews = [
  { url: "/home", timestamp: "2025-06-10T09:15:00Z" },
  { url: "/about", timestamp: "2025-06-10T09:45:00Z" },
  { url: "/home", timestamp: "2025-06-10T10:20:00Z" },
  { url: "/pricing", timestamp: "2025-06-10T10:55:00Z" },
  { url: "/home", timestamp: "2025-06-10T11:05:00Z" },
];

const byHour = groupBy(pageViews, (v) => new Date(v.timestamp).getHours().toString());
// => { "9": [2 views], "10": [2 views], "11": [1 view] }

// Transform for chart rendering
const chartData = Object.entries(byHour).map(([hour, views]) => ({
  label: `${hour}:00`,
  value: views.length,
}));
```

### **Group** translations by namespace for i18n

@keywords: translations, namespace, i18n, locale, internationalization, module

Organize flat translation entries into namespaced groups.
Perfect for i18n systems that load translations per module or page.

```typescript
const flatTranslations = [
  { key: "auth.login.title", value: "Sign In" },
  { key: "auth.login.error", value: "Invalid credentials" },
  { key: "dashboard.welcome", value: "Welcome back" },
  { key: "dashboard.stats", value: "Your statistics" },
  { key: "auth.register.title", value: "Create Account" },
];

const byNamespace = groupBy(flatTranslations, (t) => t.key.split(".")[0]);
// => {
//   auth: [login.title, login.error, register.title],
//   dashboard: [welcome, stats]
// }
```

### **Group** list items with sticky section headers

@keywords: sticky, section, headers, grouped, list, design system, contacts, a11y

Group items alphabetically or by category for a sectioned list with sticky headers.
Essential for contact lists, file explorers, and settings pages.

```typescript
const contacts = [
  { name: "Alice", phone: "555-0001" },
  { name: "Bob", phone: "555-0002" },
  { name: "Anna", phone: "555-0003" },
  { name: "Charlie", phone: "555-0004" },
  { name: "Ben", phone: "555-0005" },
];

const grouped = groupBy(contacts, (c) => c.name[0].toUpperCase());
// => { A: [Alice, Anna], B: [Bob, Ben], C: [Charlie] }

// Render with sticky headers
Object.entries(grouped).map(([letter, items]) => (
  <section>
    <h3 className="sticky-header">{letter}</h3>
    {items.map((c) => <ContactRow key={c.phone} contact={c} />)}
  </section>
));
```

### **Group** drag-and-drop items by column

@keywords: drag, drop, column, kanban, board, design system, panels

Organize items into kanban columns after a drag-and-drop reorder.
Essential for project management boards and workflow builders.

```typescript
const tasks = [
  { id: "t1", title: "Design mockup", column: "todo" },
  { id: "t2", title: "Write tests", column: "in-progress" },
  { id: "t3", title: "Fix bug #42", column: "in-progress" },
  { id: "t4", title: "Deploy v2", column: "done" },
];

const columns = groupBy(tasks, (t) => t.column);
// => { todo: [t1], "in-progress": [t2, t3], done: [t4] }

// After drag: update task column and re-group
const moveTask = (taskId: string, newColumn: string) => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) task.column = newColumn;
  return groupBy(tasks, (t) => t.column);
};
```
