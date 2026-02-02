## `isTypedArray`

### **Check** typed array 📍

@keywords: typed, array, buffer, binary

Check if value is a TypedArray.

```typescript
ArrayBuffer.isView(new Uint8Array(2));   // true
ArrayBuffer.isView(new Float32Array());  // true
ArrayBuffer.isView([1, 2, 3]);           // false
```

### **Handle** binary data

@keywords: binary, data, buffer, processing

Detect binary data for special handling.

```typescript
function processData(data: unknown) {
  if (ArrayBuffer.isView(data)) {
    return processBinary(data);
  }
  return processJSON(data);
}
```
