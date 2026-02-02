## `mockConsole` / `silenceConsole` / `withSilentConsole`

### **Assert console output** in tests 📍

@keywords: assert, console, output, tests, capture

Capture and assert on console method calls during tests.
Essential for testing logging behavior.

```typescript
const { mocks, restore } = mockConsole('log', 'warn');
userService.login('john@example.com');
expect(mocks.log.callCount).toBe(1);
restore();
```

### **Silence noisy dependencies** 📍

@keywords: silence, noisy, dependencies, clean, output

Suppress console output from third-party libraries during tests.
Keeps test output clean.

```typescript
const restore = silenceConsole();
noisyLibrary.init(); // Logs are silenced
restore();
```

### **Scoped silence** for specific operations

@keywords: scoped, silence, wrapper, cleanup, automatic

Silence console for specific code blocks with automatic cleanup.

```typescript
const result = withSilentConsole(() => {
  return riskyOperation(); // Logs silenced, auto-restored
});
```
