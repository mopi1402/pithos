## `wrap` 💎

> Add behavior around any function — perfect for logging, validation, or middleware.

### **Wrap** function with logic 📍

@keywords: wrap, decorator, middleware, around

Add behavior around a function.

```typescript
const withLogging = (fn) => (...args) => {
  console.log("Calling with:", args);
  const result = fn(...args);
  console.log("Result:", result);
  return result;
};

const add = (a, b) => a + b;
const logged = withLogging(add);
```

### **Add** error handling

@keywords: error, handling, try, catch

Wrap with try-catch.

```typescript
const safe = (fn) => (...args) => {
  try { return fn(...args); }
  catch (e) { console.error(e); }
};
```

### **Measure** performance

@keywords: measure, performance, timing

Wrap to track execution time.

```typescript
const timed = (fn) => (...args) => {
  const start = Date.now();
  const result = fn(...args);
  console.log(`Took ${Date.now() - start}ms`);
  return result;
};
```
