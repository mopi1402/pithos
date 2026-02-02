## `pad` / `padStart` / `padEnd`

### **Pad** to fixed width 📍

@keywords: pad, fixed, width, format

Pad string to fixed length.

```typescript
"5".padStart(3, "0");   // => "005"
"5".padEnd(3, "0");     // => "500"
```

### **Format** numbers

@keywords: format, numbers, leading, zeros

Add leading zeros.

```typescript
const id = String(num).padStart(5, "0");
// 42 => "00042"
```

### **Align** text

@keywords: align, text, columns, table

Create aligned columns.

```typescript
const label = name.padEnd(20);
const value = price.padStart(10);
```
