## `each` ⭐

### **Iterate** over items for side effects 📍

@keywords: iterate, forEach, side-effects, logging, analytics

Execute a function for each element for logging or analytics.

```typescript
const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
users.forEach(user => console.log(`Processing: ${user.name}`));
```

### **Traverse** object properties

@keywords: traverse, object, properties, validation

Iterate over all properties of an object.

```typescript
const config = { apiUrl: "https://api.com", timeout: 5000 };
Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) console.warn(`${key} is undefined`);
});
```

### **Process** form fields

@keywords: process, forms, fields, DOM

Iterate over elements for bulk operations.

```typescript
const fields = document.querySelectorAll("input");
[...fields].forEach(field => field.value = "");
```
