## `mockDOMRect`

### **Simulate** element dimensions 📍

@keywords: simulate, dimensions, DOMRect, layout, geometry, testing

Mock `DOMRect` for testing layout logic or geometry calculations in Node.js environments.
Useful for testing components relying on `getBoundingClientRect()`.
```typescript
const { DOMRect, restore } = mockDOMRect();
const rect = new DOMRect(0, 0, 100, 50);
expect(rect.width).toBe(100);
restore();
```

### **Test** intersection calculations

@keywords: test, intersection, collision, overlap, geometry, calculations

Verify collision detection or overlap logic.
```typescript
const { DOMRect, restore } = mockDOMRect();
const rectA = new DOMRect(0, 0, 100, 100);
const rectB = new DOMRect(50, 50, 100, 100);

expect(rectsIntersect(rectA, rectB)).toBe(true);
restore();
```
