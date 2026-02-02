## `parseFloat`

### **Parse** floating-point numbers 📍

@keywords: parse, float, decimal, conversion, default, safe

Convert a string to a float, with a required default value for failures.
Essential for reading configuration values or user input strings.

```typescript
const taxRate = parseFloat(env.TAX_RATE, 0.2);
```

### **Safeguard** against NaN

@keywords: safeguard, NaN, validation, calculations, safety, fallback

Ensure a calculation never propagates `NaN` from bad input.
Critical for financial or scientific calculations.

```typescript
const validValue = parseFloat(userInput, 0); // Returns 0 if input is "abc"
```
