## `chunk` ⭐

### **Pagination** of large datasets 📍

@keywords: pagination, pages, datasets, split, results, huge dataset, loading

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

@keywords: batch, processing, API, calls, network, rate-limiting, bulk, performance, huge dataset, scripts

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

@keywords: grid, layout, UI, rows, dashboard, gallery, responsive, design system

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

@keywords: stock, market, bourse, trading, realtime, ticker, batch, financial, performance, payment

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


### **Render** image gallery rows

@keywords: gallery, images, rows, grid, responsive, design system, loading

Split images into rows for a masonry or grid gallery layout.
Essential for photo galleries, portfolio pages, and media browsers.

```typescript
const images = [
  { src: "/img/1.jpg", alt: "Sunset" },
  { src: "/img/2.jpg", alt: "Mountain" },
  { src: "/img/3.jpg", alt: "Ocean" },
  { src: "/img/4.jpg", alt: "Forest" },
  { src: "/img/5.jpg", alt: "City" },
  { src: "/img/6.jpg", alt: "Desert" },
];

const rows = chunk(images, 3);
// => [[Sunset, Mountain, Ocean], [Forest, City, Desert]]

rows.map((row) => (
  <div className="gallery-row">
    {row.map((img) => <img src={img.src} alt={img.alt} loading="lazy" />)}
  </div>
));
```

### **Split** CI pipeline steps into parallel stages

@keywords: CI, pipeline, parallel, stages, jobs, scripts, ci/cd, performance

Group CI tasks into parallel execution stages.
Perfect for optimizing build pipelines by running independent tasks concurrently.

```typescript
const ciTasks = ["lint", "typecheck", "unit-tests", "e2e-tests", "build", "deploy"];

const stages = chunk(ciTasks, 2);
// => [["lint", "typecheck"], ["unit-tests", "e2e-tests"], ["build", "deploy"]]

for (const stage of stages) {
  await Promise.all(stage.map((task) => runTask(task)));
  console.log(`Stage completed: ${stage.join(", ")}`);
}
```

### **Prepare** virtual scroll buffer windows

@keywords: virtual, scroll, buffer, viewport, rows, performance, design system, huge dataset

Split a large dataset into viewport-sized chunks for virtual scrolling.
Essential for rendering massive lists without creating thousands of DOM nodes.

```typescript
const allRows = range(0, 10000).map((i) => ({ id: i, label: `Row ${i}` }));
const VIEWPORT_SIZE = 20;

const virtualChunks = chunk(allRows, VIEWPORT_SIZE);
// => 500 chunks of 20 rows each

// Render only the visible chunk
const visibleChunkIndex = Math.floor(scrollTop / (ROW_HEIGHT * VIEWPORT_SIZE));
renderRows(virtualChunks[visibleChunkIndex]);
```
