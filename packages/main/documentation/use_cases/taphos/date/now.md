## `now`

### **Get** current timestamp 📍

@keywords: now, timestamp, current, time

Get the current Unix timestamp in milliseconds.

```typescript
Date.now();
// => 1705708800000
```

### **Measure** elapsed time

@keywords: measure, elapsed, performance, duration

Calculate time between operations.

```typescript
const start = Date.now();
// ... operation ...
const elapsed = Date.now() - start;
```

### **Generate** unique IDs

@keywords: generate, unique, ID, timestamp

Use timestamp for unique identifiers.

```typescript
const id = `item_${Date.now()}`;
// => "item_1705708800000"
```
