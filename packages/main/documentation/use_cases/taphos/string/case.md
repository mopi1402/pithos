## `toLower` / `toUpper` / `lowerCase` / `upperCase`

### **Change** case 📍

@keywords: case, lower, upper, transform

Transform string case.

```typescript
"Hello".toLowerCase();  // => "hello"
"Hello".toUpperCase();  // => "HELLO"
```

### **Normalize** for comparison

@keywords: normalize, compare, case-insensitive

Case-insensitive comparison.

```typescript
const match = a.toLowerCase() === b.toLowerCase();
```

### **Format** display text

@keywords: format, display, text, label

Format for UI display.

```typescript
const label = key.toUpperCase();
const value = input.toLowerCase();
```
