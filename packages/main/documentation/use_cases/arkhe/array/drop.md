## `drop`

### **Implement cursor-based pagination** 📍

@keywords: pagination, cursor, skip, infinite-scroll, loading

Skip already-fetched items when loading more content.
Essential for infinite scroll or "Load More" buttons.

```typescript
const allMessages = ["msg1", "msg2", "msg3", "msg4", "msg5", "msg6"];
const alreadyLoaded = 3;

const nextBatch = drop(allMessages, alreadyLoaded);
// => ["msg4", "msg5", "msg6"]
```

### **Skip metadata rows** in imported data

@keywords: skip, metadata, header, CSV, import, spreadsheet

Remove header lines from CSV or spreadsheet imports.
Critical for data processing pipelines.

```typescript
const csvRows = [
  "Name,Age,City", // Header
  "Alice,25,Paris",
  "Bob,30,Lyon",
];

const dataRows = drop(csvRows, 1);
// => ["Alice,25,Paris", "Bob,30,Lyon"]
```

### **Exclude first N results** from search

@keywords: exclude, search, promoted, sponsored, organic, results

Remove promoted or pinned items to get organic results.
Useful for search engines or content feeds.

```typescript
const searchResults = [
  { title: "Sponsored: Product A", sponsored: true },
  { title: "Sponsored: Product B", sponsored: true },
  { title: "Organic Result 1", sponsored: false },
  { title: "Organic Result 2", sponsored: false },
];

const organicOnly = drop(searchResults, 2);
// => [{ title: "Organic Result 1" }, { title: "Organic Result 2" }]
```
