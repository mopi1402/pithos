## `propertyOf`

### **Create** property getter 📍

@keywords: property, getter, object, accessor

Create function to get property from fixed object.

```typescript
const obj = { a: 1, b: 2, c: 3 };
const getValue = (key: keyof typeof obj) => obj[key];
getValue('a');  // 1
getValue('b');  // 2
```

### **Map** keys to values

@keywords: map, keys, values, lookup

Convert array of keys to values.

```typescript
const config = { host: 'localhost', port: 3000 };
const keys = ['host', 'port'] as const;
const values = keys.map(k => config[k]);
// ['localhost', 3000]
```
