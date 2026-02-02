## `differenceWith`

### **Filter objects with custom deep equality** 📍

@keywords: filter, objects, equality, comparator, deep, matching

Compare complex objects using a custom comparator for deep or partial matching.
Perfect for comparing objects that don't share the same reference but have equivalent values.

```typescript
const inventory = [
  { name: "Apple", quantity: 10 },
  { name: "Banana", quantity: 5 },
  { name: "Orange", quantity: 8 },
];
const soldOut = [{ name: "Banana", quantity: 5 }];

const inStock = differenceWith(
  inventory,
  soldOut,
  (a, b) => a.name === b.name && a.quantity === b.quantity
);
// => [{ name: "Apple", quantity: 10 }, { name: "Orange", quantity: 8 }]
```

### **Exclude items with tolerance-based comparison**

@keywords: exclude, tolerance, comparison, threshold, precision, numeric

Filter out elements where values are "close enough" rather than exactly equal.
Perfect for numeric comparisons with floating-point precision or threshold-based filtering.

```typescript
const measurements = [10.01, 20.02, 30.03, 40.04];
const calibrationErrors = [10.0, 30.0];

const validMeasurements = differenceWith(
  measurements,
  calibrationErrors,
  (a, b) => Math.abs(a - b) < 0.1
);
// => [20.02, 40.04]
```

### **Filter with cross-type comparison**

@keywords: filter, cross-type, comparison, mapping, entities, matching

Compare arrays of different types using a custom mapping logic.
Perfect for matching entities from different sources (e.g., IDs vs full objects, strings vs objects).

```typescript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];
const bannedUserIds = [2, 3];

const activeUsers = differenceWith(
  users,
  bannedUserIds,
  (user, id) => user.id === id
);
// => [{ id: 1, name: "Alice" }]
```
