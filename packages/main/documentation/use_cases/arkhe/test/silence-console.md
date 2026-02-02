## `silenceConsole`

### **Mute** expected errors 📍

@keywords: mute, errors, expected, silence, testing, boundaries

Prevent specific console methods from printing during a test block.
Useful when testing error boundaries that naturally log errors.
```typescript
const restore = silenceConsole('error');

// This error is expected and handled
renderWithError(<BrokenComponent />);

restore();
```

### **Clean** test output

@keywords: clean, output, testing, readable, verbose, logs

Keep test reports readable by silencing verbose debug logs.
```typescript
const restore = silenceConsole('log', 'debug');

runVerboseOperation();

restore();
```
