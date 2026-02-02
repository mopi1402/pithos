## `mockConsole` ⭐

### **Spy** on logs 📍

@keywords: spy, logs, console, testing, capture, verification

Capture console output to verify logging behavior without cluttering test output.
Essential for verifying warning/error logging logic.
```typescript
const { mocks, restore } = mockConsole('warn');
console.warn('Something went wrong');

expect(mocks.warn.callCount).toBe(1);
restore();
```

### **Suppress** noisy output

@keywords: suppress, noisy, output, silence, testing, clean

Silence console logs during specific tests to keep test reports clean.
```typescript
const { restore } = mockConsole('log', { passthrough: false });
console.log('This will not appear in terminal');
restore();
```

### **Verify** log content

@keywords: verify, logs, content, assertions, messages, testing

Assert on the actual messages logged.
```typescript
const { mocks, restore } = mockConsole('error');
validateInput(null);

expect(mocks.error.calls[0][0]).toContain('Invalid input');
restore();
```
