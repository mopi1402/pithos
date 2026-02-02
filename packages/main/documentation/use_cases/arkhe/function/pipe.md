## `pipe` ⭐

### **Function composition** and chaining 📍

@keywords: composition, chaining, functional, pipeline, transformation, flow

Compose multiple functions in a readable left-to-right manner.
Essential for functional programming and clean data processing workflows.

```typescript
const add = (n) => n + 1;
const double = (n) => n * 2;
const square = (n) => n * n;

const process = pipe(add, double, square);
// ((n + 1) * 2) ^ 2

process(2); // ((2+1)*2)^2 = 36
```

### **Data transformation** pipelines

@keywords: transformation, pipelines, processing, ETL, data, flow

Transform data through multiple steps with type-safe function composition.
Essential for complex data processing and ETL operations.

```typescript
const cleanInput = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, "-")
);

cleanInput("  Hello World  "); // "hello-world"
```
