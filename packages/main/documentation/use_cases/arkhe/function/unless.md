## `unless` 💎

> The logical inverse of `when`. Applies a transformation only if the predicate is false.

### **Add defaults** only when missing 📍

@keywords: defaults, conditional, missing, normalization, URL, prefix

Add 'https://' prefix only when URL doesn't already have it.
Essential for URL normalization and ensuring valid links.

```typescript
const ensureProto = (url) => 
  unless(url, (u) => u.startsWith("http"), (u) => `https://${u}`);

ensureProto("google.com"); // "https://google.com"
ensureProto("https://site.com"); // "https://site.com"
```

### **Skip validation** for admin users

@keywords: skip, validation, conditional, admin, permissions, roles

Apply validation rules only for non-admin users.
Critical for permission systems and role-based logic.

```typescript
const validate = (user) => 
  unless(user, (u) => u.isAdmin, (u) => {
    if (!u.email) throw new Error("Email required");
    return u;
  });
```
