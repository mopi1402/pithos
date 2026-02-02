## `findLastIndex`

### **Find the last occurrence index** of a matching element 📍

@keywords: find, last, index, occurrence, position, recent

Locate the index of the last element that satisfies a condition.
Perfect for finding the most recent match position in logs, history, or ordered data.

```typescript
const activities = [
  { type: "login", time: "08:00" },
  { type: "purchase", time: "09:30" },
  { type: "login", time: "12:00" },
  { type: "logout", time: "18:00" },
];

const lastLoginIndex = findLastIndex(activities, (a) => a.type === "login");
// => 2
```

### **Find the last valid entry index** before errors

@keywords: find, valid, error, recovery, checkpoint, rollback

Identify the position of the last successful or valid record in a sequence.
Perfect for error recovery, checkpointing, or rollback scenarios.

```typescript
const operations = [
  { id: 1, status: "success" },
  { id: 2, status: "success" },
  { id: 3, status: "failed" },
  { id: 4, status: "failed" },
];

const lastSuccessIndex = findLastIndex(
  operations,
  (op) => op.status === "success"
);
// => 1
```

### **Locate the last element index** meeting a numeric threshold

@keywords: locate, threshold, numeric, trends, peaks, analysis

Find the index of the last value that passes a numeric condition.
Perfect for analyzing trends, finding peaks, or locating threshold crossings.

```typescript
const temperatures = [18, 22, 25, 30, 28, 24, 19, 17];

const lastHotDayIndex = findLastIndex(temperatures, (temp) => temp >= 25);
// => 4 (value: 28)
```
