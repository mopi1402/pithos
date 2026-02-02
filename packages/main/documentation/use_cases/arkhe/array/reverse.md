## `reverse`

### **Display newest-first** without mutating source 📍

@keywords: reverse, chronological, immutable, newest first, display

Reverse chronological data for UI display.
Native `array.reverse()` mutates - this returns a new array safely.

```typescript
const commits = ["Initial commit", "Add feature", "Fix bug", "Release v1.0"];

const newestFirst = reverse(commits);
// => ["Release v1.0", "Fix bug", "Add feature", "Initial commit"]

console.log(commits[0]);
// => "Initial commit" (original unchanged ✅)
```

### **Toggle sort direction** in data tables

@keywords: sort direction, toggle, ascending, descending, data table

Switch between ascending and descending views.
Common pattern for sortable columns.

```typescript
const prices = [19.99, 29.99, 49.99, 99.99];

const descending = reverse(prices);
// => [99.99, 49.99, 29.99, 19.99]
```

### **Process items in LIFO order**

@keywords: LIFO, stack, undo, breadcrumbs, navigation history

Handle stack-like structures without mutation.
Useful for undo systems, breadcrumbs, or navigation history.

```typescript
const breadcrumbs = ["Home", "Products", "Electronics", "Laptops"];

const backPath = reverse(breadcrumbs);
// => ["Laptops", "Electronics", "Products", "Home"]
```
