## `dropRight`

### **Remove incomplete trailing data** 📍

@keywords: remove, incomplete, trailing, partial, unfinished, realtime

Exclude the last N entries that may be partial or unfinished.
Perfect for real-time data streams or live metrics.

```typescript
const liveMetrics = [
  { minute: "10:01", value: 150 },
  { minute: "10:02", value: 148 },
  { minute: "10:03", value: 152 },
  { minute: "10:04", value: 45 }, // Incomplete minute
];

const completeData = dropRight(liveMetrics, 1);
// => First 3 entries only
```

### **Exclude future-dated entries**

@keywords: exclude, future, scheduled, draft, calendar, publishing

Remove scheduled or draft items from the end of sorted lists.
Useful for publishing systems or event calendars.

```typescript
const posts = [
  { title: "Published 1", date: "2025-01-10" },
  { title: "Published 2", date: "2025-01-15" },
  { title: "Scheduled", date: "2025-02-01" },
  { title: "Draft", date: "2025-03-01" },
];

const liveContent = dropRight(posts, 2);
// => Only published posts
```

### **Trim trailing placeholders** from fixed-length records

@keywords: trim, placeholders, padding, filler, records, parsing

Remove padding or filler values from data structures.
Essential for parsing binary formats or legacy systems.

```typescript
const record = ["John", "Doe", "john@mail.com", "", "", ""];

const cleanRecord = dropRight(record, 3);
// => ["John", "Doe", "john@mail.com"]
```
