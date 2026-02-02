## `isNaN`

### **Check** NaN value 📍

@keywords: nan, number, validate, invalid

Check if value is NaN (Not a Number).

```typescript
Number.isNaN(NaN);        // true
Number.isNaN(undefined);  // false
Number.isNaN('hello');    // false
```

### **Validate** parsed numbers

@keywords: parse, validate, number, input

Check if parsing produced valid number.

```typescript
const parsed = parseFloat(userInput);
if (Number.isNaN(parsed)) {
  console.log('Invalid number');
}
```
