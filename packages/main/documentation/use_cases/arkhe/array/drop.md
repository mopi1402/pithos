## `drop`

### **Implement cursor-based pagination** 📍

@keywords: pagination, cursor, skip, infinite-scroll, loading, huge dataset

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

### **Skip** already-rendered items in infinite scroll

@keywords: skip, rendered, infinite scroll, offset, pagination, design system, loading

Drop items already visible when loading the next batch in an infinite scroll.
Essential for feed-based UIs and content-heavy pages.

```typescript
const allPosts = await fetchAllPosts();
const alreadyVisible = currentPage * PAGE_SIZE;

const nextBatch = take(drop(allPosts, alreadyVisible), PAGE_SIZE);
// => Next PAGE_SIZE posts after what's already shown

appendToFeed(nextBatch);
```

### **Slice** visible rows for virtual scroll viewport

@keywords: virtual, scroll, viewport, slice, visible, rows, design system, huge dataset, performance

Drop items above the viewport and take only the visible portion for rendering.
Essential for virtual scroll implementations that render only what's visible.

```typescript
const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 600;
const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);

const getVisibleRows = (allRows: Row[], scrollTop: number) => {
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  return take(drop(allRows, startIndex), visibleCount + 2); // +2 for buffer
};

container.addEventListener("scroll", throttle(() => {
  const visible = getVisibleRows(allData, container.scrollTop);
  renderRows(visible);
}, 16));
```

### **Remove** sticky header rows from a grouped list

@keywords: sticky, header, group, section, list, design system

Drop the group header items to get only the data rows within a section.
Perfect for grouped lists with sticky section headers.

```typescript
const sectionItems = [
  { type: "header", label: "Today" },
  { type: "item", text: "Meeting at 10am" },
  { type: "item", text: "Lunch with team" },
  { type: "item", text: "Code review" },
];

const dataOnly = drop(sectionItems, 1);
// => [Meeting, Lunch, Code review] (header removed)
```
