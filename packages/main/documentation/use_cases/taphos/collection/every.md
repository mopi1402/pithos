## `every`

### **Validate** all items match criteria 📍

@keywords: validate, every, all, criteria, check

Check if all elements satisfy a condition.

```typescript
const ages = [18, 25, 30, 22];
ages.every(age => age >= 18);
// => true
```

### **Check** form validity

@keywords: check, form, validity, required

Verify all form fields are valid.

```typescript
const fields = [{ value: "a" }, { value: "b" }, { value: "" }];
fields.every(f => f.value.length > 0);
// => false
```

### **Ensure** permissions granted

@keywords: ensure, permissions, granted, access

Check if all required permissions are granted.

```typescript
const permissions = ["read", "write", "execute"];
const granted = ["read", "write", "execute"];
permissions.every(p => granted.includes(p));
// => true
```
