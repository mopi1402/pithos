## `upperCase`

### **Convert** to upper case words 📍

@keywords: upper, case, words, convert, split

Convert string to space-separated uppercase words.
Useful for headers, labels, or constants display.

```typescript
upperCase('fooBar');       // => 'FOO BAR'
upperCase('__foo_bar__');  // => 'FOO BAR'
upperCase('--Foo-Bar--');  // => 'FOO BAR'
```

### **Format** header text

@keywords: format, header, title, display, label, design system

Format identifiers as uppercase display text.

```typescript
const header = upperCase('contentType');
// => 'CONTENT TYPE'
```
