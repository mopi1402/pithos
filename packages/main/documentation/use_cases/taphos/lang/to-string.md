## `toString`

### **Convert** to string 📍

@keywords: convert, string, coerce, stringify

Convert any value to string.

```typescript
String(value);
// or
`${value}`;
// or
value?.toString() ?? "";
```

### **Safe** string conversion

@keywords: safe, null, undefined, handle

Handle null/undefined.

```typescript
value == null ? "" : String(value);
```

### **Template** literal

@keywords: template, literal, interpolation

Embed values in strings.

```typescript
const msg = `User: ${name}, Age: ${age}`;
```
