## `isNonUndefined`

### **Verify** definition

@keywords: verify, undefined, definition, parameters, optional, provided

Strictly check that a value is not `undefined` (allows `null`).
Useful for checking if a parameter was provided, even if it's null.

```typescript
if (isNonUndefined(param)) {
  // param was passed (could be null)
}
```
