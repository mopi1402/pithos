## `thru`

### **Transform** in chain 📍

@keywords: thru, transform, chain, pipe

Apply transformation in chain.

```typescript
// Instead of thru, just use variables or pipes
const filtered = data.filter(x => x > 0);
const chunked = chunk(filtered, 3);
const result = chunked.map(process);
```

### **Wrap** intermediate result

@keywords: wrap, intermediate, transform

Transform result before continuing.

```typescript
const process = (arr) => {
  const filtered = arr.filter(Boolean);
  const transformed = customTransform(filtered);
  return transformed.map(finalize);
};
```

### **Compose** operations

@keywords: compose, pipe, operations

Chain operations with function composition.

```typescript
const result = [filter, transform, finalize]
  .reduce((acc, fn) => fn(acc), data);
```
