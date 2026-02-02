## `flatten`

### **Flatten** nested arrays one level 📍

@keywords: flatten, nested, arrays, level, normalize

Flatten one level of nesting in arrays.

```typescript
const nested = [[1, 2], [3, 4], [5]];
nested.flat();
// => [1, 2, 3, 4, 5]
```

### **Merge** grouped results

@keywords: merge, grouped, results, combine

Combine results from grouped operations.

```typescript
const grouped = [users.slice(0, 10), users.slice(10, 20)];
grouped.flat();
// => all users in single array
```

### **Normalize** API responses

@keywords: normalize, API, responses, structure

Flatten nested response structures.

```typescript
const responses = [apiPage1.items, apiPage2.items];
responses.flat();
```
