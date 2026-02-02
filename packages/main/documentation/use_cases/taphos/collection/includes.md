## `includes`

### **Check** element presence 📍

@keywords: check, includes, presence, exists

Check if a value exists in an array.

```typescript
const roles = ["admin", "moderator", "user"];
roles.includes("admin");
// => true
```

### **Validate** allowed values

@keywords: validate, allowed, values, whitelist

Check if a value is in an allowlist.

```typescript
const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
allowedTypes.includes(file.type);
```

### **Check** string contains substring

@keywords: check, string, contains, substring

Verify if a string contains a specific substring.

```typescript
const email = "user@example.com";
email.includes("@");
// => true
```
