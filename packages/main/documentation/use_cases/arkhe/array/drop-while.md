## `dropWhile`

### **Skip leading falsy or invalid entries** 📍

@keywords: skip, leading, falsy, invalid, validation, cleanup

Drop elements from the start of an array while they fail a validation check.
Perfect for processing data streams, logs, or inputs that may have leading garbage values.

```typescript
const logs = ["", "", "INFO: Started", "DEBUG: Loaded", "ERROR: Failed"];

const meaningfulLogs = dropWhile(logs, (log) => log === "");
// => ["INFO: Started", "DEBUG: Loaded", "ERROR: Failed"]
```

### **Skip sorted elements below a threshold**

@keywords: skip, sorted, threshold, condition, timeseries, filtering

Drop leading elements from a sorted array until a condition is met.
Perfect for time-series data, paginated results, or filtering out outdated entries.

```typescript
const transactions = [
  { date: new Date("2024-01-15"), amount: 100 },
  { date: new Date("2024-06-20"), amount: 250 },
  { date: new Date("2025-01-10"), amount: 75 },
  { date: new Date("2025-03-05"), amount: 300 },
];

const thisYearTransactions = dropWhile(
  transactions,
  (t) => t.date.getFullYear() < 2025
);
// => [{ date: 2025-01-10, amount: 75 }, { date: 2025-03-05, amount: 300 }]
```

### **Skip header rows** in structured data

@keywords: skip, header, metadata, CSV, parsing, structured

Drop leading metadata or header rows before processing actual content.
Perfect for parsing CSV files, API responses with metadata, or documents with preambles.

```typescript
const csvRows = [
  { type: "header", value: "Name,Age,City" },
  { type: "header", value: "---,---,---" },
  { type: "data", value: "Alice,25,Paris" },
  { type: "data", value: "Bob,30,Lyon" },
];

const dataRows = dropWhile(csvRows, (row) => row.type === "header");
// => [{ type: "data", value: "Alice,25,Paris" }, { type: "data", value: "Bob,30,Lyon" }]
```
