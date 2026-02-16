## `lowerCase`

### **Convert** to lower case words 📍

@keywords: lower, case, words, convert, split

Convert string to space-separated lowercase words.
Useful for display labels or normalizing mixed-case input.

```typescript
lowerCase('fooBar');       // => 'foo bar'
lowerCase('__FOO_BAR__');  // => 'foo bar'
lowerCase('--Foo-Bar--');  // => 'foo bar'
```

### **Normalize** text for display

@keywords: normalize, text, display, format, label

Format programmatic identifiers into human-readable labels.

```typescript
const label = lowerCase('backgroundColor');
// => 'background color'
```
