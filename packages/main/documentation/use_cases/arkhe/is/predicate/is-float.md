## `isFloat`

### **Detect** decimal numbers 📍

@keywords: detect, float, decimal, fractional, precision, numbers

Check if a number has a fractional part.
Useful for differentiating integers from floating-point values in data parsing.

```typescript
if (isFloat(price)) {
  console.log(`Precise price: ${price}`);
}
```

### **Validate** geometric coordinates

@keywords: validate, coordinates, geometric, precision, mapping, GPS

Ensure coordinates are precise floating-point numbers.
Perfect for mapping applications or graphics rendering.

```typescript
if (isFloat(latitude) && isFloat(longitude)) {
  updateMarkerPosition(latitude, longitude);
}
```
