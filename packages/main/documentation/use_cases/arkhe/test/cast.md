## `cast` 💎

> Encapsulates unsafe casts (`as unknown as T` or `as any`, ...) in one place. No more `// eslint-disable-next-line @typescript-eslint/no-explicit-any` scattered across test files.

### **Access** private members 📍

@keywords: access, private, members, testing, white-box, internal

Bypass TypeScript visibility modifiers to test internal state.
Essential for white-box testing of classes.
```typescript
class Counter {
  private count = 0;
}
const instance = new Counter();
const internals = cast<{ count: number }>(instance);
expect(internals.count).toBe(0);
```

### **Force** incompatible types

@keywords: force, incompatible, types, testing, error-handling, invalid

Pass intentionally wrong types to test error handling paths.
```typescript
// Test that function handles invalid input gracefully
const result = myFunction(cast<string>(123));
expect(result.error).toBe('Expected string');
```
