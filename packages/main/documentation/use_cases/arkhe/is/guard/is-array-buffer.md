## `isArrayBuffer`

### **Handle** binary data

@keywords: handle, binary, ArrayBuffer, data, files, low-level

Verify if a value is a raw binary data buffer.
Critical for low-level data manipulation and file processing.

```typescript
if (isArrayBuffer(content)) {
  const view = new Uint8Array(content);
  // process binary data
}
```
