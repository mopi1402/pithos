## `kebabCase` ⭐

### **Format** CSS classes 📍

@keywords: format, CSS, classes, kebab-case, slugs, URLs

Convert strings to `kebab-case` for CSS class names or URL slugs.
Essential for frontend development and SEO-friendly URLs.

```typescript
const className = kebabCase('MenuList'); // 'menu-list'
const slug = kebabCase('Hello World Post'); // 'hello-world-post'
```

### **Generate** URL slugs from titles

@keywords: slug, URL, SEO, title, blog, routing, permalink

Convert article or product titles into SEO-friendly URL slugs.
Essential for blogs, CMS platforms, and any content with human-readable URLs.

```typescript
const articleTitle = "How to Build a REST API with TypeScript";

const slug = kebabCase(articleTitle);
// => "how-to-build-a-rest-api-with-type-script"

const url = `/blog/${slug}`;
// => "/blog/how-to-build-a-rest-api-with-type-script"
```
