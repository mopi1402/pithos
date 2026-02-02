## `take`

### **Limit results** to first N items 📍

@keywords: limit, first N, top, preview, results

Get the first N elements from an array.
Essential for "Top 10" lists, previews, or limiting API responses.

```typescript
const allProducts = [
  { name: "Laptop", sales: 1500 },
  { name: "Phone", sales: 3200 },
  { name: "Tablet", sales: 800 },
  { name: "Watch", sales: 2100 },
  { name: "Headphones", sales: 1800 },
];

const topThree = take(allProducts, 3);
// => [Laptop, Phone, Tablet]
```

### **Preview content** without loading everything

@keywords: preview, show more, lazy loading, partial content, truncate

Show a preview of items before revealing the full list.
Perfect for "Show more" patterns or lazy loading.

```typescript
const notifications = [
  { id: 1, message: "New comment on your post" },
  { id: 2, message: "You have a new follower" },
  { id: 3, message: "Your order shipped" },
  { id: 4, message: "Password changed" },
  { id: 5, message: "New message received" },
];

const preview = take(notifications, 3);
// => First 3 notifications
// Show "See 2 more" button
```

### **Get first page** of data

@keywords: pagination, first page, batch, initial load, page size

Extract the first batch for initial page load.
Useful for pagination or infinite scroll initialization.

```typescript
const allItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
const pageSize = 20;

const firstPage = take(allItems, pageSize);
// => ["Item 1", "Item 2", ..., "Item 20"]
```
