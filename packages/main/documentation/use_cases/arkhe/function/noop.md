## `noop`

### **Provide default** callbacks 📍

@keywords: default, callbacks, placeholder, optional, safety, null-checks

Use as a placeholder for optional callback functions to avoid null checks.
Essential for cleaner code and avoiding "if (callback)" checks.

```typescript
function fetchData(onSuccess = noop) {
  // Safe to call even if not provided
  onSuccess();
}

fetchData(); // No error
```

### **Stub functions** for testing 📍

@keywords: stub, testing, mocking, placeholder, unit-tests, dependencies

Use as a placeholder for dependencies during unit testing.
Useful for mocking functions that don't need to return values.

```typescript
const mockLogger = {
  info: noop,
  warn: noop,
  error: noop,
};

// Test logic without filling console with logs
processData(data, mockLogger);
```

### **Disable event handlers** temporarily

@keywords: disable, handlers, events, mute, temporary, feature-flags

Replace active handlers with noop to "mute" functionality without removing listeners.
Useful for feature flags or temporary disabling during maintenance.
```typescript
let onNotification = showToast;

// Mute notifications during focus mode
function enableFocusMode() {
  onNotification = noop;
}

function disableFocusMode() {
  onNotification = showToast;
}

// Code doesn't need to check if handler exists
socket.on("notification", (msg) => onNotification(msg));
```
