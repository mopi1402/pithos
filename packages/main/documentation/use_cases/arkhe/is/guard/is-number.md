## `isNumber`

### **Validate** numeric inputs 📍

@keywords: validate, number, numeric, inputs, calculations, forms

Ensure a value is a number before calculations.
Essential for form handling and data validation.
```typescript
if (isNumber(input) && !isNaN(input)) {
  const total = input + tax;
}
```

### **Filter** valid numbers from mixed data

@keywords: filter, numbers, mixed, types, extraction, validation

Extract numeric values from arrays containing mixed types.
```typescript
const values = [1, "two", 3, null, 4];
const numbers = values.filter(isNumber);
// numbers: number[] = [1, 3, 4]
```
