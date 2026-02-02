## `isBoolean`

### **Check** binary flags

@keywords: check, boolean, flags, binary, toggle, configuration

Verify if a value is strictly `true` or `false`.
Perfect for validating configuration flags or toggle states.

```typescript
if (isBoolean(config.isEnabled)) {
  toggleFeature(config.isEnabled);
}
```
