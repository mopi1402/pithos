## `has`

### **Check** property existence 📍

@keywords: check, property, existence, validation, own, hasOwnProperty

Safely check if an object has a property as its own key (not inherited).
Essential for robust validation against prototypes.

```typescript
if (has(data, 'result')) {
  process(data.result);
}
```

### **Detect** explicit `undefined`

@keywords: detect, undefined, explicit, missing, differentiate, validation

Distinguish between a property that exists but is `undefined` vs a missing property.
`get()` returns `undefined` in both cases, `has()` differentiates.

```typescript
const obj = { start: undefined };
has(obj, 'start'); // true
has(obj, 'end');   // false
```

### **Validate** dynamic keys

@keywords: validate, dynamic, keys, variable, cache, lookup

Check for the presence of a key when the key name is variable.
Useful in loops or dynamic logic.

```typescript
const key = getCurrentKey();
if (!has(cache, key)) {
  loadData(key);
}
```
