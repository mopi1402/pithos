## `isNil` ⭐

### **Check** for nullish values 📍

@keywords: check, null, undefined, nullish, optional, defensive

Check if a value is `null` or `undefined`.
Essential for defensive programming and optional value handling.

```typescript
if (isNil(value)) {
  return defaultValue;
}
```

### **Early return** for missing data

@keywords: early-return, missing, guard, validation, safety, defensive

Guard clauses to exit early when required data is missing.
```typescript
function processUser(user: User | null | undefined) {
  if (isNil(user)) {
    return { error: "User not found" };
  }
  
  // TypeScript knows user is User here
  return { name: user.name, email: user.email };
}
```
