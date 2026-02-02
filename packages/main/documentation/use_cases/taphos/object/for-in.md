## `forIn` / `forOwn`

### **Iterate** own properties 📍

@keywords: iterate, own, properties, loop

Loop over object's own properties.

```typescript
for (const key of Object.keys(obj)) {
  console.log(key, obj[key]);
}
```

### **Process** each property

@keywords: process, property, transform

Apply function to each property.

```typescript
Object.entries(obj).forEach(([key, value]) => {
  process(key, value);
});
```

### **Validate** all properties

@keywords: validate, all, properties, check

Check each property value.

```typescript
for (const [key, value] of Object.entries(config)) {
  if (value === undefined) throw new Error(`Missing: ${key}`);
}
```
