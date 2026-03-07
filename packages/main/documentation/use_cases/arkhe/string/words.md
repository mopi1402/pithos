## `words`

### **Parse variable names** for display 📍

@keywords: parse, variable, camelCase, PascalCase, labels, i18n

Convert code-style identifiers to readable words.
Essential for auto-generating labels from API field names.

```typescript
words('firstName');      // => ['first', 'Name']
words('XMLHttpRequest'); // => ['XML', 'Http', 'Request']
```

### **Build search indexes** from content 📍

@keywords: search, index, tokenize, keywords, full-text, seo

Extract searchable tokens from mixed-format content.
Useful for building client-side search.

```typescript
words('async-data in JavaScript_apps');
// => ['async', 'data', 'in', 'Java', 'Script', 'apps']
```

### **Slug generation** from titles

@keywords: slug, URL, SEO, friendly, kebab, seo

Create URL-friendly slugs from titles with any naming convention.

```typescript
words('How to Use XMLHttpRequest').join('-').toLowerCase();
// => 'how-to-use-xml-http-request'
```
