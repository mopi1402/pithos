## `isNonNullable` 💎

> A powerful utility that filters out both null and undefined, narrowing types effectively.

### **Filter** missing values 📍

@keywords: filter, missing, nullable, narrowing, cleanup, validation

Remove `null` and `undefined` from arrays while narrowing types.
Perfect for cleaning data lists before processing.

```typescript
const items = [1, null, 2, undefined, 3];
const cleanItems = items.filter(isNonNullable); // Type is number[]
```

### **Chain** with optional access

@keywords: chain, optional, chaining, pipeline, safe, narrowing

Combine with optional chaining for clean null-safe pipelines.
```typescript
const userNames = users
  .map(u => u.profile?.displayName)
  .filter(isNonNullable);
// Type: string[] (no undefined)
```
