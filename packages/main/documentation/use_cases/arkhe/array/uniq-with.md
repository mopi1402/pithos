## `uniqWith`

### **Deduplicate with custom equality** 📍

@keywords: deduplicate, custom equality, comparison, fuzzy matching, objects

Remove duplicates using a custom comparison function.
Perfect for complex objects or fuzzy matching.

```typescript
const products = [
  { name: "Laptop", price: 999.99 },
  { name: "LAPTOP", price: 999.99 },
  { name: "Phone", price: 699 },
];

const unique = uniqWith(
  products,
  (a, b) => a.name.toLowerCase() === b.name.toLowerCase() && a.price === b.price
);
// => [Laptop, Phone]
```

### **Remove near-duplicates** with tolerance

@keywords: tolerance, near-duplicates, numeric, sensor data, approximate

Deduplicate numeric values within a tolerance range.
Useful for sensor data, measurements, or approximate matching.

```typescript
const readings = [10.01, 10.02, 20.0, 10.03, 30.0];

const unique = uniqWith(readings, (a, b) => Math.abs(a - b) < 0.1);
// => [10.01, 20.0, 30.0]
```

### **Deep equality** deduplication

@keywords: deep equality, nested objects, deduplication, complex structures, JSON

Remove duplicates based on deep object comparison.
Essential for complex nested structures.

```typescript
const configs = [
  { settings: { theme: "dark", lang: "en" } },
  { settings: { theme: "dark", lang: "en" } },
  { settings: { theme: "light", lang: "fr" } },
];

const unique = uniqWith(
  configs,
  (a, b) => JSON.stringify(a.settings) === JSON.stringify(b.settings)
);
// => [dark/en, light/fr]
```
