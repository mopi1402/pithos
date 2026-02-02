## `isPromise`

### **Detect** async operations

@keywords: detect, async, Promise, thenable, operations, await

Check if a value behaves like a Promise (thenable).
Essential for handling mixed synchronous and asynchronous APIs.

```typescript
if (isPromise(result)) {
  await result;
}
```
