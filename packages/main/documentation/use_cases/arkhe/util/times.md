## `times` ⭐

### **Repeat** operations 📍

@keywords: repeat, operations, loop, invoke, collect, functional

Invoke a function `n` times and collect the results.
Cleaner than `for` loops or `Array.from({ length: n })`.
```typescript
const ids = times(5, (index) => `id-${index}`);
// ['id-0', 'id-1', 'id-2', 'id-3', 'id-4']
```

### **Generate** test fixtures

@keywords: generate, fixtures, testing, mocks, data, objects

Create multiple mock objects for testing.
```typescript
const mockUsers = times(10, (index) => ({
  id: index,
  name: `User ${index}`,
  email: `user${index}@test.com`
}));
```

### **Initialize** grid data

@keywords: initialize, grid, matrix, data, structures, populate

Populate matrices or grid structures.
```typescript
const grid = times(rows, (row) =>
  times(cols, (col) => ({ row, col, value: null }))
);
```

### **Render** skeleton loading placeholders

@keywords: skeleton, loading, placeholder, shimmer, UI, design-system

Generate placeholder components while data is loading.
Cleaner than manually repeating JSX elements.

```typescript
const SkeletonList = ({ count }: { count: number }) => (
  <ul>
    {times(count, (i) => (
      <li key={i} className="skeleton-row" aria-hidden="true" />
    ))}
  </ul>
);

// Usage: <SkeletonList count={5} />
```
