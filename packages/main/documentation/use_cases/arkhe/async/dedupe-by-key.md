## `dedupeByKey` 💎

> Prevents duplicate concurrent execution. If 5 components invoke an operation with the same key, only 1 is executed and the result is shared.

### **Prevent** duplicate API calls 📍

@keywords: prevent, duplicate, deduplication, concurrent, cache, optimization

Queue API calls by key to prevent multiple identical requests from being made simultaneously.
Essential for avoiding race conditions and reducing unnecessary network traffic.

```typescript
// Prevent duplicate user fetches
const getUserData = async (userId: string) => {
  return await dedupeByKey(`user-${userId}`, async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
};

// Multiple calls with same userId will only make one API request
const user1 = await getUserData("123");
const user2 = await getUserData("123");
const user3 = await getUserData("123");
// Only one API call is made, all return the same result
```

### **Manage** resource loading efficiently

@keywords: manage, resources, loading, cache, performance, optimization

Prevent duplicate resource loading operations to optimize performance.
Critical for image loading, heavy computations, or cache warming.

```typescript
// Prevent duplicate cache operations
const getCachedData = async (cacheKey: string) => {
  return await dedupeByKey(`cache-${cacheKey}`, async () => {
    let data = await cache.get(cacheKey);
    if (!data) {
      data = await expensiveOperation();
      await cache.set(cacheKey, data);
    }
    return data;
  });
};
```

### **Shared initialization** across modules

@keywords: shared, initialization, singleton, setup, connection, modules

Ensure expensive setup runs only once even when triggered from multiple entry points.
Perfect for lazy singletons, connection pools, or SDK initialization.
```typescript
const getDatabase = () => {
  return dedupeByKey("db-connection", async () => {
    console.log("Connecting to database...");
    const connection = await createConnection(config);
    await connection.runMigrations();
    return connection;
  });
};

// Called from multiple modules simultaneously
const [db1, db2, db3] = await Promise.all([
  getDatabase(), // From user-service
  getDatabase(), // From order-service  
  getDatabase(), // From notification-service
]);

// "Connecting to database..." logged only once
// db1 === db2 === db3 (same instance)
```
