## `chunk` ⭐

### **Pagination** of large datasets 📍

@keywords: pagination, pages, datasets, split, results

Split large result sets into smaller pages for better user experience and reduced loading times.
Essential for e-commerce product listings, user directories, or any data-heavy interfaces.

```typescript
const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Tablet" },
  { id: 4, name: "Watch" },
  { id: 5, name: "Headphones" },
];

const pageSize = 2;
const pages = chunk(products, pageSize);
// => Page 1: [Laptop, Phone], Page 2: [Tablet, Watch], Page 3: [Headphones]
```

### **Batch processing** for API calls 📍

@keywords: batch, processing, API, calls, network, rate-limiting, bulk

Group multiple operations together to reduce network overhead and avoid rate-limiting.
Critical for bulk operations like sending notifications, syncing data, or processing payments.

```typescript
const userIds = [101, 102, 103, 104, 105, 106, 107, 108];

const batches = chunk(userIds, 3);

for (const batch of batches) {
  await api.sendNotifications(batch); // 3 users at a time
}
```

### **Grid layouts** in UI components

@keywords: grid, layout, UI, rows, dashboard, gallery, responsive

Organize items into rows for consistent visual presentation in dashboards or galleries.
Ensures responsive design and maintains visual hierarchy across different screen sizes.

```typescript
const items = ["A", "B", "C", "D", "E", "F", "G"];

const rows = chunk(items, 4);
// => [["A", "B", "C", "D"], ["E", "F", "G"]]

// Render as grid
rows.map((row) => (
  <Row>
    {row.map((item) => (
      <Card>{item}</Card>
    ))}
  </Row>
));
```

### **Batch stock updates** for real-time dashboards

@keywords: stock, market, bourse, trading, realtime, ticker, batch, financial

Process stock price updates in batches to prevent UI overload on trading dashboards.
Critical for financial applications handling high-frequency market data.

```typescript
const stockUpdates = [
  { symbol: "AAPL", price: 178.50, change: +1.2 },
  { symbol: "GOOGL", price: 141.80, change: -0.5 },
  { symbol: "MSFT", price: 378.90, change: +2.1 },
  { symbol: "AMZN", price: 178.25, change: +0.8 },
  { symbol: "TSLA", price: 248.50, change: -3.2 },
  { symbol: "META", price: 505.60, change: +1.5 },
];

// Update dashboard in batches of 3 to prevent UI freeze
const updateBatches = chunk(stockUpdates, 3);

for (const batch of updateBatches) {
  requestAnimationFrame(() => {
    batch.forEach((stock) => updateTickerWidget(stock));
  });
}
```

