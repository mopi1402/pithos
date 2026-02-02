## `nth`

### **Access** element by index 📍

@keywords: nth, index, element, access, array

Get element at specific index, supporting negative indices.

```typescript
const items = ['a', 'b', 'c', 'd'];
items[1];                    // 'b'
items[items.length - 1];     // 'd' (last)
```

### **Get** last element

@keywords: last, element, array, negative

Access last element without knowing array length.

```typescript
const stack = [1, 2, 3, 4, 5];
const last = stack[stack.length - 1];  // 5
```
