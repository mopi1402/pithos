## `attempt`

### **Safe** function call 📍

@keywords: attempt, try, catch, safe

Handle errors gracefully.

```typescript
try {
  return JSON.parse(str);
} catch {
  return undefined;
}
```

### **Wrap** risky operation

@keywords: wrap, error, handle, fallback

Provide fallback on error.

```typescript
const safeJSON = (str) => {
  try { return JSON.parse(str); }
  catch { return null; }
};
```

### **Optional** chain alternative

@keywords: optional, chain, try, access

Use try-catch for risky access.

```typescript
try {
  return obj.deeply.nested.value;
} catch {
  return defaultValue;
}
```
