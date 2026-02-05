## `upperFirst`

### **Capitalize** first letter 📍

@keywords: capitalize, first, upper, letter

Uppercase first character only.

```typescript
const result = upperFirst('hello'); // 'Hello'
```

### **Format** user-generated sentences

@keywords: format, sentence, user, content, display, normalize

Ensure the first letter of user-submitted text is capitalized for consistent display.

```typescript
const formatComment = (text: string) => upperFirst(text.trim());

formatComment('great article, thanks!');
// => 'Great article, thanks!'
```

### **Build** component names from strings

@keywords: component, name, dynamic, React, convention, PascalCase

Capitalize the first letter when constructing dynamic component or class names.

```typescript
const getComponentName = (type: string) => `Icon${upperFirst(type)}`;

getComponentName('arrow');  // 'IconArrow'
getComponentName('check');  // 'IconCheck'
```
