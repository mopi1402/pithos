## `isBuffer` / `isTypedArray`

### **Check** buffer type 📍

@keywords: buffer, typed array, check, binary

Check for binary data types.

```typescript
value instanceof ArrayBuffer;
value instanceof Uint8Array;
ArrayBuffer.isView(value);
```

### **Validate** binary data

@keywords: validate, binary, data, buffer

Verify value is a typed array.

```typescript
if (value instanceof Uint8Array) {
  processBinary(value);
}
```

### **Check** any typed array

@keywords: check, typed, array, view

Check for any TypedArray.

```typescript
ArrayBuffer.isView(value) && !(value instanceof DataView);
```
