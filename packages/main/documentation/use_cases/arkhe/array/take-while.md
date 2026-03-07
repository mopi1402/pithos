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

### **Extract** visible items above the fold

@keywords: visible, above fold, viewport, lazy loading, design system, performance, seo

Take items that fit within the initial viewport height for eager rendering.
Essential for above-the-fold optimization and lazy loading the rest.

```typescript
const items = [
  { id: 1, height: 80 },
  { id: 2, height: 120 },
  { id: 3, height: 100 },
  { id: 4, height: 90 },
  { id: 5, height: 110 },
];

let totalHeight = 0;
const aboveFold = takeWhile(items, (item) => {
  totalHeight += item.height;
  return totalHeight <= window.innerHeight;
});
// => Items that fit in the viewport, rendered eagerly
// Remaining items get loading="lazy"
```

### **Get** completed steps prefix in a stepper

@keywords: stepper, completed, steps, wizard, progress, design system

Extract the consecutive completed steps from the beginning of a wizard.
Essential for stepper components showing progress and determining the furthest reachable step.

```typescript
const steps = [
  { label: "Account", status: "completed" },
  { label: "Profile", status: "completed" },
  { label: "Address", status: "completed" },
  { label: "Payment", status: "current" },
  { label: "Confirm", status: "pending" },
];

const completedSteps = takeWhile(steps, (s) => s.status === "completed");
// => [Account, Profile, Address]

const progressPercent = (completedSteps.length / steps.length) * 100;
progressBar.style.width = `${progressPercent}%`;
// => 60% progress
```

### **Collect** consecutive pinned items at the top of a list

@keywords: pinned, sticky, top, priority, list, design system

Take all leading pinned items to render them in a sticky section.
Perfect for chat apps, task lists, or feeds with pinned content.

```typescript
const messages = [
  { id: 1, pinned: true, text: "Welcome to the channel" },
  { id: 2, pinned: true, text: "Read the rules" },
  { id: 3, pinned: false, text: "Hey everyone" },
  { id: 4, pinned: false, text: "What's up?" },
];

const pinnedMessages = takeWhile(messages, (m) => m.pinned);
// => [Welcome, Rules] - rendered in sticky header
```
