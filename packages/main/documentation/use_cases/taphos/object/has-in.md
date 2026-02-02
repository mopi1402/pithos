## `hasIn`

### **Check** property exists 📍

@keywords: has, property, check, exists

Check if property exists on object.

```typescript
"key" in obj;
// or
Object.hasOwn(obj, "key");
```

### **Safe** property access

@keywords: safe, access, optional, chaining

Check before accessing.

```typescript
if ("user" in data && "name" in data.user) {
  return data.user.name;
}
```

### **Optional** chaining alternative

@keywords: optional, chaining, null, safe

Use optional chaining instead.

```typescript
data?.user?.name;
```
