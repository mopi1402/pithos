## `withSilentConsole` 💎

### **Wrap** noisy functions 📍

@keywords: wrap, noisy, functions, silence, automatic, restore

Execute a function with silenced console output, automatically restoring afterwards.
Perfect for cleaner syntax without manual restore calls.
```typescript
await withSilentConsole(async () => {
  await component.triggerError();
}, 'error');
// Console automatically restored here
```

### **Test** error scenarios cleanly

@keywords: test, errors, scenarios, assertions, clean, testing

Combine with assertions inside the callback.
```typescript
await withSilentConsole(async () => {
  const result = await failingOperation();
  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
}, 'error', 'warn');
```
