## `isFunction`

### **Execute** callbacks safely 📍

@keywords: execute, callbacks, safety, functions, invocation, optional

Verify if a property is a callable function before invocation.
Essential for event handlers and optional callback execution.
```typescript
if (isFunction(props.onComplete)) {
  props.onComplete(result);
}
```

### **Resolve value-or-getter** patterns

@keywords: resolve, getter, patterns, dynamic, values, configuration

Handle props that can be either static values or functions returning values.
Common pattern in React and configuration APIs.
```typescript
type MaybeGetter<T> = T | (() => T);

function resolve<T>(value: MaybeGetter<T>): T {
  return isFunction(value) ? value() : value;
}

const title = resolve(props.title); // Works with "Hello" or () => "Hello"
```
