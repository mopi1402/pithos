## `stubArray` / `stubFalse` / `stubObject` / `stubString` / `stubTrue`

### **Default** factories 📍

@keywords: stub, default, factory, empty

Functions returning default values.

```typescript
const stubArray = () => [];
const stubObject = () => ({});
const stubString = () => "";
const stubTrue = () => true;
const stubFalse = () => false;
```

### **Default** parameter

@keywords: default, parameter, factory, fresh

Use factory for fresh default values.

```typescript
const getItems = (factory = () => []) => factory();
```

### **Placeholder** function

@keywords: placeholder, function, callback

Simple placeholder callbacks.

```typescript
const config = {
  onSuccess: () => {},
  onError: () => {}
};
```
