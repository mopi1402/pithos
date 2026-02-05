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

### **Validate** uploaded files meet constraints

@keywords: validate, upload, files, size, type, MIME, constraints, form

Check that all files in an upload batch respect size and type limits.
Essential for file upload forms, document management, and media libraries.

```typescript
const maxSize = 5 * 1024 * 1024; // 5MB
const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

const files = [
  { name: "photo.jpg", size: 2_000_000, type: "image/jpeg" },
  { name: "doc.pdf", size: 1_500_000, type: "application/pdf" },
  { name: "huge.png", size: 8_000_000, type: "image/png" },
];

const allValid = every(files, (f) => f.size <= maxSize && allowedTypes.includes(f.type));
// => false (huge.png exceeds 5MB)
```
