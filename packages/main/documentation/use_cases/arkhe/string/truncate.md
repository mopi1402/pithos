## `truncate`

### **Preview text** for content cards 📍

@keywords: preview, text, cards, excerpt, summary, blog

Display short previews of long content in cards or lists.
Essential for article listings, product descriptions, or comment previews.

```typescript
const preview = truncate(article.content, { length: 80 });
// => "TypeScript generics provide a way to create reusable components..."
```

### **Word-boundary truncation** for readable excerpts 📍

@keywords: word, boundary, readable, natural, separator

Truncate at word boundaries for more natural reading.
Avoids cutting words in half.

```typescript
truncate(description, { length: 30, separator: ' ' });
// => "The quick brown fox jumps..."
```

### **Custom omission** for branded experiences

@keywords: custom, omission, ellipsis, branding, UX

Use custom omission strings for branded "read more" indicators.

```typescript
truncate(post, { length: 50, omission: '… [voir plus]' });
// => "This is a very long social… [voir plus]"
```

### **Truncate** file names in a file explorer

@keywords: file, name, explorer, path, overflow, UI

Shorten long file names in a file tree or upload list while keeping the extension visible.

```typescript
const truncateFileName = (name: string, maxLen: number) => {
  const ext = name.slice(name.lastIndexOf('.'));
  if (name.length <= maxLen) return name;
  return truncate(name.slice(0, -ext.length), { length: maxLen - ext.length }) + ext;
};

truncateFileName('my-very-long-document-name-final-v2.pdf', 25);
// => "my-very-long-docum....pdf"
```
