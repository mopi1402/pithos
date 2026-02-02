## `zipWith`

### **Combine arrays with transformation** 📍

@keywords: zip, transform, combine, calculation, parallel datasets

Merge arrays while applying a function to each group.
Perfect for calculations across parallel datasets.

```typescript
const prices = [100, 200, 150];
const quantities = [2, 1, 3];

const totals = zipWith(prices, quantities, (price, qty) => price * qty);
// => [200, 200, 450]
```

### **Calculate differences** between datasets

@keywords: differences, variance, comparison, element-wise, metrics

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


_Each utility is designed to solve specific array manipulation challenges in real-world development scenarios._
