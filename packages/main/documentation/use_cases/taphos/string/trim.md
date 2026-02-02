## `trim` / `trimStart` / `trimEnd`

### **Remove** whitespace 📍

@keywords: trim, whitespace, clean, strip

Remove leading/trailing whitespace.

```typescript
"  hello  ".trim();      // => "hello"
"  hello  ".trimStart(); // => "hello  "
"  hello  ".trimEnd();   // => "  hello"
```

### **Clean** user input

@keywords: clean, input, form, normalize

Normalize form input.

```typescript
const email = inputValue.trim().toLowerCase();
```

### **Process** text lines

@keywords: process, lines, text, clean

Clean each line in multiline text.

```typescript
const lines = text.split("\n").map(l => l.trim());
```
