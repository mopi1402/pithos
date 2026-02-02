## `isString`

### **Validate** text input 📍

@keywords: validate, string, text, input, manipulation, forms

Ensure a value is a string before manipulation.
Essential for form handling and text processing.

```typescript
if (isString(input)) {
  const trimmed = input.trim();
  saveToDatabase(trimmed);
}
```

### **Filter** strings from mixed arrays

@keywords: filter, strings, mixed, arrays, extraction, types

Extract string values from arrays containing mixed types.
```typescript
const values = ["hello", 42, "world", null, true];
const strings = values.filter(isString);
// strings: string[] = ["hello", "world"]
```
