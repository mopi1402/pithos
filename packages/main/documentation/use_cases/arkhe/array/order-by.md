## `orderBy` ⭐

### **Sort by multiple criteria** 📍

@keywords: sort, multiple criteria, data table, leaderboard, ranking

Organize data with primary and secondary sort keys.
Perfect for data tables, leaderboards, or search results.

```typescript
const employees = [
  { name: "Alice", department: "Engineering", salary: 95000 },
  { name: "Bob", department: "Sales", salary: 78000 },
  { name: "Charlie", department: "Engineering", salary: 120000 },
  { name: "Diana", department: "Engineering", salary: 95000 },
];

const sorted = orderBy(employees, ["department", "salary"], ["asc", "desc"]);
// => [Charlie (Eng, 120k), Alice (Eng, 95k), Diana (Eng, 95k), Bob (Sales, 78k)]
```

### **Rank products** by rating and reviews 📍

@keywords: ranking, products, rating, reviews, e-commerce

Create leaderboards with multiple ranking factors.
Ideal for e-commerce listings or recommendation engines.

```typescript
const products = [
  { name: "Pro Keyboard", rating: 4.5, reviews: 1250 },
  { name: "Basic Keyboard", rating: 4.2, reviews: 3400 },
  { name: "Gaming Keyboard", rating: 4.5, reviews: 890 },
];

const ranked = orderBy(products, ["rating", "reviews"], ["desc", "desc"]);
// => [Pro Keyboard, Gaming Keyboard, Basic Keyboard]
```

### **Sort with custom iteratee**

@keywords: custom sort, iteratee, computed values, priority, tasks

Use functions for computed sort values.
Useful for complex business logic or derived fields.

```typescript
const tasks = [
  { title: "Bug fix", priority: "high", dueDate: new Date("2024-01-20") },
  { title: "Feature", priority: "low", dueDate: new Date("2024-01-18") },
  { title: "Refactor", priority: "high", dueDate: new Date("2024-01-15") },
];

const priorityOrder = { high: 0, medium: 1, low: 2 };

const sorted = orderBy(
  tasks,
  [(t) => priorityOrder[t.priority], (t) => t.dueDate.getTime()],
  ["asc", "asc"]
);
// => [Refactor (high, Jan 15), Bug fix (high, Jan 20), Feature (low, Jan 18)]
```

### **Real-time leaderboard** for sports competitions

@keywords: sports, leaderboard, ranking, competition, athletes, tournament, score

Rank athletes or teams in real-time during live competitions.
Essential for sports apps, esports tournaments, and fitness challenges.

```typescript
const athletes = [
  { name: "Usain Bolt", time: 9.58, country: "JAM", personalBest: 9.58 },
  { name: "Tyson Gay", time: 9.69, country: "USA", personalBest: 9.69 },
  { name: "Yohan Blake", time: 9.75, country: "JAM", personalBest: 9.69 },
  { name: "Justin Gatlin", time: 9.74, country: "USA", personalBest: 9.74 },
];

// Rank by finish time (ascending), then by personal best
const leaderboard = orderBy(
  athletes,
  ["time", "personalBest"],
  ["asc", "asc"]
);
// => [Bolt (9.58), Gay (9.69), Gatlin (9.74), Blake (9.75)]

// For live updates, re-sort as times come in
const updateLeaderboard = (newResult) => {
  athletes.push(newResult);
  return orderBy(athletes, ["time"], ["asc"]);
};
```


### **Sort notifications** by unread status then by date

@keywords: notifications, unread, sort, inbox, priority, date, messaging

Display unread notifications first, then sort by most recent.
Universal pattern for any app with a notification center or inbox.

```typescript
const notifications = [
  { id: 1, message: "New comment", read: true, date: "2025-06-10T09:00:00Z" },
  { id: 2, message: "Mention in #general", read: false, date: "2025-06-09T14:00:00Z" },
  { id: 3, message: "PR approved", read: false, date: "2025-06-10T11:00:00Z" },
  { id: 4, message: "Build failed", read: true, date: "2025-06-10T10:00:00Z" },
];

const sorted = orderBy(
  notifications,
  [(n) => (n.read ? 1 : 0), "date"],
  ["asc", "desc"]
);
// => [PR approved (unread, Jun 10), Mention (unread, Jun 9), Build failed (read), New comment (read)]
```
