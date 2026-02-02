## `isNaN`

### **Check** NaN value 📍

@keywords: NaN, not a number, check, validate

Check if a value is NaN.

```typescript
Number.isNaN(NaN);        // => true
Number.isNaN(undefined);  // => false
Number.isNaN("hello");    // => false
```

### **Validate** parsed number

@keywords: validate, parse, number, input

Check if parsing succeeded.

```typescript
const num = parseFloat(input);
if (Number.isNaN(num)) {
  throw new Error("Invalid number");
}
```

### **Filter** out NaN

@keywords: filter, NaN, clean, data

Remove NaN values from array.

```typescript
const nums = [1, NaN, 3, NaN, 5];
nums.filter(n => !Number.isNaN(n));
// => [1, 3, 5]
```
