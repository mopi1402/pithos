## `isInteger`

### **Check** integer value 📍

@keywords: integer, whole, number, validate

Verify a value is a whole number.

```typescript
Number.isInteger(42);    // => true
Number.isInteger(42.5);  // => false
Number.isInteger("42");  // => false
```

### **Validate** array index

@keywords: validate, index, array, integer

Ensure value is valid for array indexing.

```typescript
if (Number.isInteger(index) && index >= 0) {
  return arr[index];
}
```

### **Filter** integers

@keywords: filter, integers, whole

Extract only whole numbers.

```typescript
const nums = [1, 2.5, 3, 4.1, 5];
nums.filter(Number.isInteger);
// => [1, 3, 5]
```
