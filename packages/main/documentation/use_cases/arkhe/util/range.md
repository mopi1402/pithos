## `range` ⭐

### **Generate** numeric sequences 📍

@keywords: generate, sequences, numbers, iteration, range, Python

Create arrays of numbers for iteration or data generation.
Comparable to Python's `range()` function.
```typescript
const indices = range(5); // [0, 1, 2, 3, 4]
const evens = range(0, 10, 2); // [0, 2, 4, 6, 8]
```

### **Create** pagination controls

@keywords: create, pagination, controls, pages, navigation, UI

Generate page numbers for navigation components.
```typescript
const totalPages = 10;
const pages = range(1, totalPages + 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### **Render** placeholder skeletons

@keywords: render, placeholders, skeletons, loading, React, UI

Generate indices for list rendering in React.
```typescript
const skeletons = range(pageSize).map((i) => (
  <Skeleton key={i} />
));
```

### **Generate** dropdown options for forms

@keywords: dropdown, select, options, form, hours, years, UI, input

Create numeric options for time pickers, year selectors, or quantity inputs.
Very common in form-heavy applications with numeric selection fields.

```typescript
// Hour picker: 0–23
const hours = range(0, 24);
// => [0, 1, 2, ..., 23]

// Year selector: 2020–2030
const years = range(2020, 2031);
// => [2020, 2021, ..., 2030]

// Quantity selector: 1–10
const quantities = range(1, 11);
// => [1, 2, 3, ..., 10]

// Render as <select> options
years.map((year) => <option key={year} value={year}>{year}</option>);
```
