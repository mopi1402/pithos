## `parseIntDef` ⭐

### **Parse** integers safely 📍

@keywords: parse, integer, safe, default, pagination, radix

Convert strings to integers with nullish handling and default values.
Essential for pagination (page numbers, limits) and ID handling.

```typescript
const page = parseIntDef(params.page, 1);
const limit = parseIntDef(params.limit, 20);
```

### **Specify** radix explicitly

@keywords: radix, binary, octal, hexadecimal, parsing, base

Parse binary, octal, or hexadecimal strings safely.
Useful for low-level data processing or color parsing.

```typescript
const flags = parseIntDef("1010", 0, 2); // Binary to decimal: 10
const color = parseIntDef("FF", 0, 16);  // Hex to decimal: 255
```
