## `replace`

### **Replace** substring 📍

@keywords: replace, substitute, string, pattern

Replace part of a string.

```typescript
"hello world".replace("world", "there");
// => "hello there"
```

### **Replace** all occurrences

@keywords: replace, all, global, every

Replace every match.

```typescript
"a-b-c".replaceAll("-", "_");
// => "a_b_c"
```

### **Pattern** replacement

@keywords: pattern, regex, replace, match

Use regex for complex replacements.

```typescript
"hello123world".replace(/\d+/g, "-");
// => "hello-world"
```
