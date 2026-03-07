## `takeRightWhile`

### **Get trailing valid entries** 📍

@keywords: trailing, suffix, condition, validation, sequence

Take elements from the end while they pass a condition.
Perfect for extracting suffixes or recent valid sequences.

```typescript
const data = [1, 2, -1, 3, 4, 5];

const validSuffix = takeRightWhile(data, (n) => n > 0);
// => [3, 4, 5]
```

### **Extract recent completed tasks**

@keywords: recent, completed, tasks, status, filter

Get trailing items that match a status.
Useful for showing "recently completed" or latest successes.

```typescript
const tasks = [
  { status: "pending", name: "Task 1" },
  { status: "done", name: "Task 2" },
  { status: "done", name: "Task 3" },
  { status: "done", name: "Task 4" },
];

const recentlyCompleted = takeRightWhile(tasks, (t) => t.status === "done");
// => [Task 2, Task 3, Task 4]
```

### **Get trailing positive values**

@keywords: trailing, positive, threshold, trend, metrics

Extract suffix of values above a threshold.
Perfect for trend analysis or recent performance extraction.

```typescript
const metrics = [-5, 10, -2, 15, 20, 25];

const recentGrowth = takeRightWhile(metrics, (m) => m > 0);
// => [15, 20, 25]
```

### **Extract** recent unread notifications

@keywords: unread, notifications, recent, badge, inbox, design system

Take trailing unread notifications for a notification badge count.
Perfect for notification centers and inbox indicators.

```typescript
const notifications = [
  { id: 1, read: true, text: "Welcome" },
  { id: 2, read: true, text: "New feature" },
  { id: 3, read: false, text: "New comment" },
  { id: 4, read: false, text: "New follower" },
  { id: 5, read: false, text: "Mention in #general" },
];

const recentUnread = takeRightWhile(notifications, (n) => !n.read);
// => [New comment, New follower, Mention]

setBadgeCount(recentUnread.length); // Show "3" on bell icon
```
