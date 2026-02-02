## `isRegExp`

### **Validate** patterns

@keywords: validate, RegExp, patterns, regex, matching, validation

Ensure a value is a regular expression object.
Useful for input validation logic where patterns can be passed.

```typescript
if (isRegExp(pattern)) {
  const match = text.match(pattern);
}
```
