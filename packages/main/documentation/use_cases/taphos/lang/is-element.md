## `isElement`

### **Check** DOM element 📍

@keywords: element, DOM, check, HTML

Check if value is a DOM element.

```typescript
value instanceof Element;
// or
value instanceof HTMLElement;
```

### **Validate** before DOM ops

@keywords: validate, DOM, operations

Ensure value is an element before manipulation.

```typescript
if (target instanceof Element) {
  target.classList.add("active");
}
```

### **Type** guard

@keywords: type, guard, element, narrowing

Narrow type for TypeScript.

```typescript
const isElement = (v: unknown): v is Element => 
  v instanceof Element;
```
