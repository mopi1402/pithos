## `setGlobal` ⭐

### **Inject** global mocks 📍

@keywords: inject, global, mocks, testing, APIs, polyfill

Temporarily set a global variable (like `fetch` or `IntersectionObserver`).
Useful for mocking browser APIs in a test environment.
```typescript
const restore = setGlobal('fetch', vi.fn(() => 
  Promise.resolve({ ok: true, json: () => ({}) })
));

await fetchData('/api/users');
expect(globalThis.fetch).toHaveBeenCalled();
restore();
```

### **Mock** missing APIs

@keywords: mock, missing, APIs, polyfill, Node, testing

Polyfill APIs that don't exist in Node.js test environment.
```typescript
const restore = setGlobal('IntersectionObserver', MockIntersectionObserver);

const component = mount(<LazyImage />);
expect(component).toBeDefined();
restore();
```
