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

### **Process** API response through a full pipeline

@keywords: API, response, pipeline, fetch, parse, normalize, filter, processing

Chain fetch, parse, normalize, and filter steps into a single readable pipeline.
The real-world pattern developers write daily when consuming API data.

```typescript
const getActiveUsers = pipe(
  (response: Response) => response.json(),
  (data: { users: User[] }) => data.users,
  (users) => users.filter((u) => u.isActive),
  (users) => users.map((u) => ({ id: u.id, name: u.name, email: u.email })),
);

const users = await fetch("/api/users").then(getActiveUsers);
// Raw response → parsed JSON → extracted array → filtered active → picked fields
```
