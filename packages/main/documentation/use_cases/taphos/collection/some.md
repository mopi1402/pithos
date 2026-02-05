## `some`

### **Check** if any item matches 📍

@keywords: some, any, exists, check

Check if at least one element satisfies a condition.

```typescript
const users = [{ admin: false }, { admin: true }, { admin: false }];
users.some(u => u.admin);
// => true
```

### **Validate** at least one selection

@keywords: validate, selection, required, form

Ensure at least one option is selected.

```typescript
const options = [{ selected: false }, { selected: false }];
options.some(o => o.selected);
// => false (no selection)
```

### **Check** for errors

@keywords: check, errors, validation, any

Determine if any validation errors exist.

```typescript
const fields = [{ error: null }, { error: "Required" }, { error: null }];
fields.some(f => f.error !== null);
// => true
```

### **Check** if user has a required role

@keywords: check, user, role, RBAC, authorization, access, permission

Verify that a user holds at least one of the required roles for access control.
Fundamental pattern for role-based authorization in any application.

```typescript
const userRoles = ["editor", "viewer"];
const requiredRoles = ["admin", "editor"];

const hasAccess = some(requiredRoles, (role) => userRoles.includes(role));
// => true (user has "editor")
```
