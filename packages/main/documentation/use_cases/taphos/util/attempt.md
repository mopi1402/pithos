## `attempt` 💎

> Wrap any function call in a try/catch and get either the result or the error.

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

### **Parse** JSON safely from untrusted sources

@keywords: parse, JSON, safe, localStorage, cookie, API, untrusted, fallback

Parse JSON from localStorage, cookies, or API responses without crashing.
The most common real-world use case for attempt — handling malformed data gracefully.

```typescript
const raw = localStorage.getItem("user-preferences");

const preferences = attempt(() => JSON.parse(raw ?? ""));
// Returns parsed object if valid JSON, or Error instance if malformed

const safePrefs = isError(preferences)
  ? { theme: "light", language: "en" }
  : preferences;
```
