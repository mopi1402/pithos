## `flatMap`

### **Map** and flatten in one step 📍

@keywords: flatMap, map, flatten, transform

Transform elements and flatten the result.

```typescript
const users = [{ tags: ["a", "b"] }, { tags: ["c"] }];
users.flatMap(u => u.tags);
// => ["a", "b", "c"]
```

### **Expand** items

@keywords: expand, duplicate, generate

Generate multiple items from each source item.

```typescript
const nums = [1, 2, 3];
nums.flatMap(n => [n, n * 10]);
// => [1, 10, 2, 20, 3, 30]
```

### **Filter** and transform

@keywords: filter, transform, combined

Combine filtering and mapping.

```typescript
const items = [1, 2, 3, 4, 5];
items.flatMap(n => n > 2 ? [n * 2] : []);
// => [6, 8, 10]
```
