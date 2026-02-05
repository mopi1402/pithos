## `padEnd`

### **Pad** end 📍

@keywords: pad, end, right, fill

Pad string at end to target length.

```typescript
'5'.padEnd(3, '0');  // '500'
```

### **Align** columns

@keywords: align, columns, table, format

Align text in columns.

```typescript
const label = name.padEnd(20, ' ');
console.log(`${label}${value}`);
```

### **Format** currency amounts with trailing zeros

@keywords: currency, amount, decimal, trailing, zeros, price

Ensure decimal amounts always display the expected number of digits.

```typescript
const formatPrice = (amount: string) => {
  const [integer, decimal = ''] = amount.split('.');
  return `${integer}.${decimal.padEnd(2, '0')}`;
};

formatPrice('9.5');  // '9.50'
formatPrice('12');   // '12.00'
```
