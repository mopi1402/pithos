## `window` 💎

> Creates sliding windows over arrays. Instead of writing error-prone for loops with `array[i]` and `array[i+1]`, get clean tuples like `[[1,2,3], [2,3,4], [3,4,5]]`. Perfect for moving averages, trend detection, and comparing consecutive elements.

### **Detecting changes** between consecutive values 📍

@keywords: changes, consecutive, delta, transitions, comparison, observability, charts

Compare adjacent elements to identify transitions, changes, or deltas in sequences.
Perfect for tracking state changes, price movements, or any sequential comparisons.

```typescript
const temperatures = [18, 19, 22, 21, 25, 24];

const changes = window(temperatures, 2).map(([prev, curr]) => curr - prev);
// => [1, 3, -1, 4, -1]

const biggestJump = Math.max(...changes);
// => 4 (between 21 and 25)
```

### **Pairwise operations** on sequences

@keywords: pairwise, pairs, consecutive, route, intervals, 3D

Process elements in pairs for comparisons, validations, or transformations.
Essential for route calculations, interval analysis, or sequential validations.

```typescript
const waypoints = ["Paris", "Lyon", "Marseille", "Nice"];

const legs = window(waypoints, 2);
// => [["Paris", "Lyon"], ["Lyon", "Marseille"], ["Marseille", "Nice"]]

const routes = legs.map(([from, to]) => `${from} → ${to}`);
// => ["Paris → Lyon", "Lyon → Marseille", "Marseille → Nice"]
```

### **Moving averages** for data smoothing

@keywords: moving average, rolling, smoothing, trend, financial, performance, ci/cd, charts

Calculate rolling averages to smooth out fluctuations and reveal underlying trends.
Essential for financial analysis, sensor data processing, and performance monitoring.

```typescript
const stockPrices = [100, 102, 98, 105, 110, 108];

const movingAvg = window(stockPrices, 3).map(
  (w) => w.reduce((a, b) => a + b, 0) / w.length
);
// => [100, 101.67, 104.33, 107.67]
```

### **Render** sparkline charts from time series

@keywords: sparkline, chart, time series, trend, dashboard, charts, design system

Generate point-to-point segments for a mini chart visualization.
Essential for inline trend indicators in dashboards and tables.

```typescript
const prices = [42, 45, 43, 48, 52, 49, 55];

const segments = window(prices, 2).map(([start, end], i) => ({
  x1: i * 10,
  y1: 100 - start,
  x2: (i + 1) * 10,
  y2: 100 - end,
  color: end >= start ? "green" : "red",
}));

// Render SVG line segments
segments.forEach((s) => drawLine(svg, s));
```

### **Buffer** visible rows in a virtual scroll viewport

@keywords: virtual, scroll, buffer, viewport, rows, design system, performance, huge dataset

Create overlapping windows of rows for smooth virtual scrolling with pre-rendered buffers.
Essential for virtual scroll implementations that need buffer zones above and below the viewport.

```typescript
const allRows = range(0, 5000).map((i) => ({ id: i, label: `Row ${i}` }));
const ROW_HEIGHT = 40;
const VIEWPORT_SIZE = 20;
const BUFFER = 5;
const WINDOW_SIZE = VIEWPORT_SIZE + BUFFER * 2; // 30 rows per window

// Pre-compute overlapping windows for O(1) scroll lookups
const rowWindows = window(allRows, WINDOW_SIZE);

const getVisibleRows = (scrollIndex: number) => {
  const windowIndex = clamp(scrollIndex - BUFFER, 0, rowWindows.length - 1);
  return rowWindows[windowIndex];
};

container.addEventListener("scroll", throttle(() => {
  const scrollIndex = Math.floor(container.scrollTop / ROW_HEIGHT);
  renderRows(getVisibleRows(scrollIndex));
}, 16));
```

### **Compute** stepper transition pairs

@keywords: stepper, transition, step, wizard, animation, design system

Generate step transition pairs for animating between wizard steps.
Perfect for stepper components with enter/leave animations between steps.

```typescript
const steps = ["Account", "Profile", "Address", "Payment", "Confirm"];

const transitions = window(steps, 2).map(([from, to]) => ({
  from,
  to,
  animation: `slide-${from}-to-${to}`,
}));
// => [{ from: "Account", to: "Profile", animation: "slide-Account-to-Profile" }, ...]

const animateStep = (currentIndex: number) => {
  const transition = transitions[currentIndex];
  if (transition) {
    playAnimation(transition.animation);
  }
};
```

### **Detect** anomalies in monitoring data

@keywords: anomaly, monitoring, spike, alert, observability, performance, charts

Compare consecutive metric windows to detect sudden spikes or drops.
Critical for alerting systems and infrastructure monitoring.

```typescript
const cpuReadings = [45, 47, 44, 92, 95, 48, 46];

const anomalies = window(cpuReadings, 2)
  .map(([prev, curr], i) => ({ index: i + 1, prev, curr, delta: curr - prev }))
  .filter((w) => Math.abs(w.delta) > 30);

// => [{ index: 3, prev: 44, curr: 92, delta: 48 }]
anomalies.forEach((a) => alertOps(`CPU spike: ${a.prev}% -> ${a.curr}%`));
```
