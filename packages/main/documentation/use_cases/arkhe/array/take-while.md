## `takeWhile`

### **Get leading valid entries** 📍

@keywords: leading, prefix, condition, validation, sequence

Take elements from the start while they pass a condition.
Perfect for extracting prefixes, headers, or valid sequences.

```typescript
const data = [1, 2, 3, -1, 4, 5];

const validPrefix = takeWhile(data, (n) => n > 0);
// => [1, 2, 3]
```

### **Extract consecutive high values**

@keywords: consecutive, high values, threshold, streak, performance

Take leading elements above a threshold.
Useful for analyzing initial performance or streak detection.

```typescript
const scores = [95, 88, 92, 75, 89, 91];

const initialHighScores = takeWhile(scores, (s) => s >= 85);
// => [95, 88, 92]
```

### **Get items until condition fails**

@keywords: condition, until, pattern, parsing, extraction

Extract elements while they match a pattern.
Perfect for parsing sequential data or conditional extraction.

```typescript
const tasks = [
  { status: "done", name: "Task 1" },
  { status: "done", name: "Task 2" },
  { status: "pending", name: "Task 3" },
  { status: "done", name: "Task 4" },
];

const completedPrefix = takeWhile(tasks, (t) => t.status === "done");
// => [Task 1, Task 2]
```
