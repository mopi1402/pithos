## `trackRestore` / `getGlobalThis`

### **Ensure cleanup** for multiple mocks 📍

@keywords: cleanup, mocks, restore, tracking, LIFO

Track mock restore functions for guaranteed cleanup in LIFO order.
Prevents test pollution when multiple global mocks are used.

```typescript
const { restore: r1 } = mockWindow({ innerWidth: 1024 });
const { restore: r2 } = mockDocument({ title: 'Test' });
// Cleanup in reverse order
r2(); r1();
```

### **Access globalThis** in cross-platform tests 📍

@keywords: globalThis, cross-platform, environment, Node, browser

Get typed access to globalThis for environment-specific testing.

```typescript
const global = getGlobalThis();
const hasDom = 'document' in global;
```

### **Build custom mocks** with tracking

@keywords: custom, mocks, tracking, restore, utilities

Create custom global mocks that integrate with the tracking system.

```typescript
const restore = trackRestore(() => {
  global.fetch = originalFetch;
});
```
