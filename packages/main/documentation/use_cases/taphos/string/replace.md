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

### **Mask** sensitive data for display

@keywords: mask, sensitive, data, PII, credit card, email, privacy, security

Partially hide sensitive information before displaying it to users.
Essential for payment UIs, account pages, and audit logs.

```typescript
const cardNumber = "4111222233334444";
const masked = replace(cardNumber, /\d{12}/, "************");
// => "************4444"

const email = "alice@example.com";
const maskedEmail = replace(email, /^(.{2}).*(@.*)$/, "$1***$2");
// => "al***@example.com"
```
