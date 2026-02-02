## `when` 💎

> A functional alternative to ternary operators. Applies a transformation only if the predicate is true.

### **Truncate text** only if too long 📍

@keywords: truncate, text, conditional, ellipsis, length, display

Add ellipsis only when text exceeds maximum length.
Essential for UI text display and responsive design.

```typescript
const truncate = (text, max) =>
  when(text, (t) => t.length > max, (t) => t.slice(0, max) + "...");

truncate("Hello World", 5); // "Hello..."
truncate("Hi", 5); // "Hi"
```

### **Apply discount** only for members 📍

@keywords: discount, conditional, members, pricing, ecommerce, calculation

Calculate discounted price only when user has membership.
Critical for e-commerce and pricing logic.

```typescript
const getPrice = (price, user) =>
  when(price, () => user.isMember, (p) => p * 0.9);
```


_Each utility is designed to solve specific function manipulation challenges in real-world development scenarios._
