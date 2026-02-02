## `mockWindow` ⭐

### **Mock** window properties 📍

@keywords: mock, window, properties, testing, responsive, viewport

Safely override `window` properties for Node.js-based tests.
Essential for testing responsive design logic or window event handlers.
```typescript
const { restore } = mockWindow({
  innerWidth: 768,
  innerHeight: 1024
});

expect(isMobile()).toBe(true);
restore();
```

### **Simulate** different viewports

@keywords: simulate, viewports, responsive, breakpoints, layout, testing

Test responsive breakpoints and layout changes.
```typescript
const { restore } = mockWindow({ innerWidth: 1920 });
expect(getBreakpoint()).toBe('desktop');
restore();

const { restore: restore2 } = mockWindow({ innerWidth: 375 });
expect(getBreakpoint()).toBe('mobile');
restore2();
```

### **Mock** storage APIs

@keywords: mock, storage, localStorage, sessionStorage, testing, persistence

Test localStorage/sessionStorage interactions.
```typescript
const storage = new Map();
const { restore } = mockWindow({
  localStorage: {
    getItem: (k) => storage.get(k),
    setItem: (k, v) => storage.set(k, v)
  }
});

savePreference('theme', 'dark');
expect(storage.get('theme')).toBe('dark');
restore();
```
