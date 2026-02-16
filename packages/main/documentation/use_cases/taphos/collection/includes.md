## `includes` ⭐

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

### **Check** if a route requires authentication

@keywords: route, authentication, protected, middleware, guard, navigation, routing

Verify if the current route is in a list of protected routes.
Fundamental pattern for auth guards in any SPA or server-side routing.

```typescript
const protectedRoutes = ["/dashboard", "/settings", "/profile", "/admin"];

function requiresAuth(path: string): boolean {
  return includes(protectedRoutes, path);
}

// In a router guard or middleware
if (requiresAuth(currentPath) && !user.isAuthenticated) {
  redirect("/login");
}
```
