## `window` 💎

> Creates sliding windows over arrays. Instead of writing error-prone for loops with `array[i]` and `array[i+1]`, get clean tuples like `[[1,2,3], [2,3,4], [3,4,5]]`. Perfect for moving averages, trend detection, and comparing consecutive elements.

### **Detecting changes** between consecutive values 📍

@keywords: changes, consecutive, delta, transitions, comparison

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

@keywords: pairwise, pairs, consecutive, route, intervals

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

@keywords: moving average, rolling, smoothing, trend, financial

Calculate rolling averages to smooth out fluctuations and reveal underlying trends.
Essential for financial analysis, sensor data processing, and performance monitoring.

```typescript
const stockPrices = [100, 102, 98, 105, 110, 108];

const movingAvg = window(stockPrices, 3).map(
  (w) => w.reduce((a, b) => a + b, 0) / w.length
);
// => [100, 101.67, 104.33, 107.67]
```
