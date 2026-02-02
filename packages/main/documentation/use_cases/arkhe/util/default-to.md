## `defaultTo`

### **Handle NaN** from calculations 📍

@keywords: NaN, calculations, fallback, math, parsing

Provide fallback values when calculations might produce NaN.
Unlike `??`, handles NaN which is a common edge case.

```typescript
defaultTo(parseInt('invalid'), 0); // => 0 (NaN falls back)
parseInt('invalid') ?? 0;          // => NaN (!! doesn't handle NaN)
```

### **Safe division** with fallback 📍

@keywords: division, safe, fallback, zero, math

Handle division edge cases where results could be NaN.

```typescript
defaultTo(part / total * 100, 0); // => 0 when total is 0
defaultTo(sum / nums.length, 0);  // => 0 for empty array
```

### **Config value resolution** with nullish fallback

@keywords: config, resolution, fallback, nullish, settings

Resolve configuration values handling null, undefined, and NaN.

```typescript
defaultTo(config.timeout, 5000);   // => 5000 if undefined
defaultTo(config.threshold, 0.5);  // => 0.5 if NaN
```
