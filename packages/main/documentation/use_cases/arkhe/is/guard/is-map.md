## `isMap`

### **Identify** key-value collections

@keywords: identify, Map, collections, key-value, cache, storage

Check if a value is a standard Map object.
Perfect for distinguishing Maps from plain objects or other iterables.

```typescript
if (isMap(cache)) {
  cache.set(key, value);
}
```
