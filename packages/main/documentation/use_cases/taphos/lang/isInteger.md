## `isInteger`

### **Validate** integer 📍

@keywords: integer, number, validate, whole

Check if value is an integer.

```typescript
Number.isInteger(42);    // true
Number.isInteger(42.0);  // true
Number.isInteger(42.5);  // false
```

### **Validate** quantity

@keywords: quantity, count, validation

Ensure quantities are whole numbers.

```typescript
function setQuantity(qty: number) {
  if (!Number.isInteger(qty) || qty < 0) {
    throw new Error('Invalid quantity');
  }
  this.quantity = qty;
}
```
