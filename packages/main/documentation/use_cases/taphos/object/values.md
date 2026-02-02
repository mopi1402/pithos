## `values`

### **Get** all values 📍

@keywords: values, object, array, extract

Extract all property values from object.

```typescript
Object.values({ a: 1, b: 2, c: 3 });
// [1, 2, 3]
```

### **Sum** numeric values

@keywords: sum, reduce, total, numeric

Calculate total of object values.

```typescript
const prices = { apple: 1.5, banana: 0.75, orange: 2 };
const total = Object.values(prices).reduce((a, b) => a + b, 0);
// 4.25
```
