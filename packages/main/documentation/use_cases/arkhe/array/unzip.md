## `unzip`

### **Separate coordinates** into individual axis arrays 📍

@keywords: coordinates, unzip, axis, visualization, charting

Transform point data into separate X, Y arrays.
Perfect for data visualization, charting libraries, or graphics.

```typescript
const points: [number, number][] = [
  [0, 10],
  [1, 25],
  [2, 18],
  [3, 42],
];

const [xValues, yValues] = unzip(points);
// xValues => [0, 1, 2, 3]
// yValues => [10, 25, 18, 42]
```

### **Parse row data** into column arrays

@keywords: row to column, parse, spreadsheet, database, columnar

Convert row-based data into columnar format for analysis.
Ideal for spreadsheet processing or database imports.

```typescript
const salesData: [string, string, number][] = [
  ["2024-01-15", "Widget A", 150],
  ["2024-01-16", "Widget B", 89],
  ["2024-01-17", "Widget A", 200],
];

const [dates, products, quantities] = unzip(salesData);
// dates => ["2024-01-15", "2024-01-16", "2024-01-17"]
// products => ["Widget A", "Widget B", "Widget A"]
// quantities => [150, 89, 200]
```

### **Decompose key-value pairs** for batch operations

@keywords: key-value, decompose, entries, batch, parallel processing

Separate keys and values from entries for parallel processing.
Useful for API requests or config management.

```typescript
const settings: [string, string | number][] = [
  ["theme", "dark"],
  ["fontSize", 14],
  ["language", "en-US"],
];

const [keys, values] = unzip(settings);
// keys => ["theme", "fontSize", "language"]
// values => ["dark", 14, "en-US"]
```
