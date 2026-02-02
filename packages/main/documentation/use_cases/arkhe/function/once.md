## `once` ⭐

### **Initialize resources** only once 📍

@keywords: initialize, once, singleton, setup, resources, idempotent

Ensure initialization code runs only once to prevent duplicate setup.
Essential for resource management and preventing initialization errors.

```typescript
const initApp = once(() => {
  console.log("App initialized");
  // ... setup code
});

initApp(); // "App initialized"
initApp(); // (ignored)
```

### **Create singletons** safely

@keywords: singleton, pattern, instance, state, management, unique

Ensure singleton instances are created only once.
Essential for state management and ensuring single instance patterns.

```typescript
const getDb = once(() => new DatabaseConnection());
const db1 = getDb();
const db2 = getDb(); 

console.log(db1 === db2); // true
```
