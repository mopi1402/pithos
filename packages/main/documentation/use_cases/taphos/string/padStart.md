## `padStart`

### **Pad** start 📍

@keywords: pad, start, left, fill

Pad string at start to target length.

```typescript
'5'.padStart(2, '0');  // '05'
```

### **Format** numbers

@keywords: format, number, leading, zeros

Add leading zeros.

```typescript
const formatted = String(num).padStart(4, '0');
// 42 → '0042'
```

### **Format** time display

@keywords: time, clock, hours, minutes, seconds, display, format

Ensure hours, minutes, and seconds always show two digits in time displays.

```typescript
const formatTime = (h: number, m: number, s: number) =>
  `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

formatTime(9, 5, 3);  // '09:05:03'
formatTime(14, 30, 0); // '14:30:00'
```

### **Generate** invoice numbers with leading zeros

@keywords: invoice, order, reference, leading, zeros, sequential, ID

Format sequential IDs into fixed-width reference numbers.

```typescript
const invoiceNumber = (id: number) => `INV-${String(id).padStart(6, '0')}`;

invoiceNumber(42);    // 'INV-000042'
invoiceNumber(12345); // 'INV-012345'
```
