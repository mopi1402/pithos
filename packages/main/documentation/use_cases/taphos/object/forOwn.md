## `forOwn`

### **Iterate** object properties 📍

@keywords: iterate, object, properties, foreach

Iterate over own enumerable properties.

```typescript
Object.entries(obj).forEach(([key, value]) => {
  console.log(key, value);
});
```

### **Transform** values

@keywords: transform, map, values, object

Process each property value.

```typescript
const result: Record<string, number> = {};
Object.entries(prices).forEach(([key, value]) => {
  result[key] = value * 1.1;  // Add 10%
});
```
