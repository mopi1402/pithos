## `isUndefined`

### **Detect** missing properties

@keywords: detect, undefined, missing, optional, defaults, parameters

Check if a value is strictly `undefined`.
Essential for checking optional parameters or missing object keys.

```typescript
if (isUndefined(options.verbose)) {
  options.verbose = true; // Set default
}
```
