## `mockDocument`

### **Mock** document properties 📍

@keywords: mock, document, properties, testing, DOM, global

Override `document` properties or methods in a test environment.
Essential for testing code that interacts with the global document object.
```typescript
const { restore } = mockDocument({
  title: 'Test Page',
  getElementById: vi.fn(() => mockElement)
});

expect(document.title).toBe('Test Page');
restore();
```

### **Simulate** missing elements

@keywords: simulate, missing, elements, fallback, testing, DOM

Test fallback behavior when DOM elements don't exist.
```typescript
const { restore } = mockDocument({
  querySelector: vi.fn(() => null)
});

const result = initComponent('#missing');
expect(result).toBeNull();
restore();
```
