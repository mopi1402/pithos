## `property` / `propertyOf`

### **Get** property accessor 📍

@keywords: property, accessor, getter, path

Create property accessor function.

```typescript
const getName = (obj) => obj.name;
users.map(getName);
// => ["Alice", "Bob"]
```

### **Dynamic** property access

@keywords: dynamic, property, access, key

Access property by variable key.

```typescript
const get = (key) => (obj) => obj[key];
const getAge = get("age");
users.map(getAge);
```

### **Pluck** values

@keywords: pluck, values, extract, map

Extract property from objects.

```typescript
items.map(item => item.id);
```
