## `escapeRegExp`

### **Safe user search** with dynamic patterns 📍

@keywords: search, user, input, safe, dynamic, regex

Create regex patterns from user input without breaking on special characters.
Essential for implementing search features with arbitrary user queries.

```typescript
const pattern = new RegExp(escapeRegExp('C++ (advanced)'), 'i');
items.filter(item => pattern.test(item));
```

### **Highlight search terms** in results 📍

@keywords: highlight, search, terms, results, mark

Safely highlight user search terms containing special characters.

```typescript
const term = '$100.00';
content.replace(new RegExp(escapeRegExp(term), 'g'), '<mark>$&</mark>');
// => "Price: <mark>$100.00</mark>"
```

### **Build dynamic regex** from config

@keywords: dynamic, regex, config, pattern, builder

Construct complex regex patterns from configuration with literal strings.

```typescript
const pattern = new RegExp(
  `^${escapeRegExp('[LOG]')}${escapeRegExp(' | ')}(ERROR|WARN)`
);
pattern.test('[LOG] | ERROR: Failed'); // => true
```
