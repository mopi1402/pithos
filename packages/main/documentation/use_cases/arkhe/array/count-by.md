## `countBy`

### **Count items** by status/category 📍

@keywords: count, status, category, occurrences, analytics, dashboard, observability, ci/cd

Count occurrences of each status or category in a collection.
Essential for dashboards, admin panels, and e-commerce analytics.

```typescript
const orders = [
  { id: 1, status: "pending" },
  { id: 2, status: "shipped" },
  { id: 3, status: "pending" },
];

countBy(orders, (order) => order.status);
// => { pending: 2, shipped: 1 }
```

### **Count occurrences** in simple arrays

@keywords: count, frequency, occurrences, survey, poll, analysis

Count frequency of each value in a flat array.
Useful for surveys, polls, and frequency analysis.

```typescript
const responses = ["yes", "no", "yes", "yes", "no"];

countBy(responses, (r) => r);
// => { yes: 3, no: 2 }
```

### **Count by** computed key

@keywords: count, computed, derived, calculated, grouping, segmentation

Count items grouped by a derived or calculated value.
Useful for segmentation and conditional grouping.

```typescript
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 32 },
];

countBy(users, (user) => (user.age >= 18 ? "adult" : "minor"));
// => { adult: 2, minor: 1 }
```

### **Display** badge counts in navigation

@keywords: badge, count, navigation, sidebar, inbox, notifications, UI, dashboard, design system

Compute counts per category to display as badges in a sidebar or nav bar.
Universal pattern for any app with "Inbox (3)", "Pending (12)", or "Errors (5)".

```typescript
const tickets = [
  { id: 1, status: "open" },
  { id: 2, status: "open" },
  { id: 3, status: "closed" },
  { id: 4, status: "in-progress" },
  { id: 5, status: "open" },
];

const counts = countBy(tickets, (t) => t.status);
// => { open: 3, closed: 1, "in-progress": 1 }

// Render in sidebar
// 📬 Open (3)
// 🔄 In Progress (1)
// ✅ Closed (1)
```

### **Count** errors by type for monitoring charts

@keywords: errors, type, monitoring, chart, observability, charts, alerting

Aggregate error counts by type for a monitoring dashboard chart.
Essential for observability dashboards and incident triage.

```typescript
const errors = [
  { type: "TypeError", message: "Cannot read property..." },
  { type: "NetworkError", message: "Failed to fetch" },
  { type: "TypeError", message: "undefined is not a function" },
  { type: "SyntaxError", message: "Unexpected token" },
  { type: "NetworkError", message: "Timeout" },
  { type: "NetworkError", message: "DNS resolution failed" },
];

const errorCounts = countBy(errors, (e) => e.type);
// => { TypeError: 2, NetworkError: 3, SyntaxError: 1 }

// Render as pie chart
renderPieChart(Object.entries(errorCounts).map(([type, count]) => ({ label: type, value: count })));
```
