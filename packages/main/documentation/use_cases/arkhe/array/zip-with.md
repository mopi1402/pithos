## `zipWith`

### **Combine arrays with transformation** 📍

@keywords: zip, transform, combine, calculation, parallel datasets, charts, 3D

Merge arrays while applying a function to each group.
Perfect for calculations across parallel datasets.

```typescript
const prices = [100, 200, 150];
const quantities = [2, 1, 3];

const totals = zipWith(prices, quantities, (price, qty) => price * qty);
// => [200, 200, 450]
```

### **Calculate differences** between datasets

@keywords: differences, variance, comparison, element-wise, metrics, charts

Compute element-wise differences or ratios.
Useful for variance analysis or comparison metrics.

```typescript
const actual = [100, 150, 200];
const expected = [120, 140, 180];

const variance = zipWith(actual, expected, (a, e) => a - e);
// => [-20, 10, 20]

const percentDiff = zipWith(
  actual,
  expected,
  (a, e) => ((a - e) / e * 100).toFixed(1) + "%"
);
// => ["-16.7%", "7.1%", "11.1%"]
```

### **Combine with custom logic**

@keywords: custom logic, merge, transformation, aggregation, complex

Merge arrays using any transformation function.
Essential for complex data merging or aggregation.

```typescript
const names = ["Alice", "Bob"];
const scores = [95, 87];
const grades = ["A", "B+"];

const results = zipWith(
  names,
  scores,
  grades,
  (name, score, grade) => `${name}: ${score} (${grade})`
);
// => ["Alice: 95 (A)", "Bob: 87 (B+)"]
```

### **Generate** chart tooltip data from parallel arrays

@keywords: chart, tooltip, labels, values, visualization, charts, dashboard

Combine label and value arrays into tooltip-ready objects.
Essential for chart libraries that store labels and data separately.

```typescript
const labels = ["Jan", "Feb", "Mar", "Apr"];
const revenue = [12000, 15000, 13500, 18000];
const expenses = [8000, 9500, 10000, 11000];

const tooltipData = zipWith(labels, revenue, expenses, (label, rev, exp) => ({
  label,
  revenue: `$${rev.toLocaleString()}`,
  expenses: `$${exp.toLocaleString()}`,
  profit: `$${(rev - exp).toLocaleString()}`,
}));
// => [{ label: "Jan", revenue: "$12,000", expenses: "$8,000", profit: "$4,000" }, ...]
```

### **Interpolate** between 3D keyframes

@keywords: interpolate, keyframes, animation, 3D, lerp, canvas, gaming

Compute intermediate positions between animation keyframes.
Essential for smooth 3D animations and motion paths.

```typescript
const startPositions = [0, 0, 0];
const endPositions = [100, 50, 200];

const lerp = (t: number) =>
  zipWith(startPositions, endPositions, (start, end) => start + (end - start) * t);

lerp(0);   // => [0, 0, 0]
lerp(0.5); // => [50, 25, 100]
lerp(1);   // => [100, 50, 200]
```
