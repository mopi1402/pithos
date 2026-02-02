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
