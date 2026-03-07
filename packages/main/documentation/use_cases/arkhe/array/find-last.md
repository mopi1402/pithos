## `findLast`

### **Find the last matching element** 📍

@keywords: find, last, matching, recent, history, logs

Locate the last element that satisfies a condition.
Perfect for finding the most recent match in logs, history, or ordered data.

```typescript
const activities = [
  { type: "login", time: "08:00" },
  { type: "purchase", time: "09:30" },
  { type: "login", time: "12:00" },
  { type: "logout", time: "18:00" },
];

const lastLogin = findLast(activities, (a) => a.type === "login");
// => { type: "login", time: "12:00" }
```

### **Find the last valid entry** before errors

@keywords: find, valid, error, recovery, checkpoint, rollback

Identify the last successful or valid record in a sequence.
Perfect for error recovery, checkpointing, or rollback scenarios.

```typescript
const operations = [
  { id: 1, status: "success" },
  { id: 2, status: "success" },
  { id: 3, status: "failed" },
  { id: 4, status: "failed" },
];

const lastSuccess = findLast(operations, (op) => op.status === "success");
// => { id: 2, status: "success" }
```

### **Locate the last element** meeting a threshold

@keywords: locate, threshold, numeric, trends, peaks, analysis

Find the last value that passes a numeric condition.
Perfect for analyzing trends, finding peaks, or locating threshold crossings.

```typescript
const temperatures = [18, 22, 25, 30, 28, 24, 19, 17];

const lastHotDay = findLast(temperatures, (temp) => temp >= 25);
// => 28
```

### **Find** the last visible element in a scroll container

@keywords: visible, scroll, last, viewport, intersection, design system, performance

Locate the last item currently visible in a scrollable container.
Essential for scroll-to-bottom detection and "jump to latest" features.

```typescript
const messages = [
  { id: 1, text: "Hello", offsetTop: 0 },
  { id: 2, text: "How are you?", offsetTop: 60 },
  { id: 3, text: "Fine thanks", offsetTop: 120 },
  { id: 4, text: "See you later", offsetTop: 180 },
];

const scrollBottom = container.scrollTop + container.clientHeight;

const lastVisible = findLast(messages, (msg) => msg.offsetTop < scrollBottom);
// => { id: 3, text: "Fine thanks" } if scrollBottom is 150

// Show "new messages" indicator if last visible != last message
if (lastVisible?.id !== messages[messages.length - 1].id) {
  showNewMessagesBadge();
}
```
