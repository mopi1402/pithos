## `castArray`

### **Ensure** array 📍

@keywords: cast, array, ensure, wrap

Ensure value is an array.

```typescript
const ensureArray = (v) => Array.isArray(v) ? v : [v];

ensureArray([1, 2]);  // => [1, 2]
ensureArray(1);       // => [1]
```

### **Normalize** input

@keywords: normalize, input, single, multiple

Accept single or multiple values.

```typescript
const ids = Array.isArray(input) ? input : [input];
ids.forEach(process);
```

### **Handle** optional array

@keywords: handle, optional, array, param

Process parameter that might be array.

```typescript
const tags = [].concat(tagOrTags);
```
