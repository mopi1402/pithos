## `isError`

### **Catch** exceptions correctly

@keywords: catch, exceptions, errors, handling, logging, debugging

Distinguish between standard Error objects and other thrown values.
Critical for robust error handling and logging.

```typescript
try {
  dangerousCall();
} catch (err) {
  if (isError(err)) {
    logError(err.message, err.stack);
  }
}
```
