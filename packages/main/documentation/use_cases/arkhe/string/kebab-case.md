## `kebabCase` ⭐

### **Format** CSS classes 📍

@keywords: format, CSS, classes, kebab-case, slugs, URLs, design system, seo

Convert strings to `kebab-case` for CSS class names or URL slugs.
Essential for frontend development and SEO-friendly URLs.

```typescript
const className = kebabCase('MenuList'); // 'menu-list'
const slug = kebabCase('Hello World Post'); // 'hello-world-post'
```

### **Generate** URL slugs from titles

@keywords: slug, URL, SEO, title, blog, routing, permalink, seo

Convert article or product titles into SEO-friendly URL slugs.
Essential for blogs, CMS platforms, and any content with human-readable URLs.

```typescript
const articleTitle = "How to Build a REST API with TypeScript";

const slug = kebabCase(articleTitle);
// => "how-to-build-a-rest-api-with-type-script"
// Note: kebabCase splits on casing boundaries, so "TypeScript" becomes "type-script".
// For proper slugs with brand names, prefer deburr + manual regex: title.toLowerCase().replace(/\s+/g, "-")

const url = `/blog/${slug}`;
// => "/blog/how-to-build-a-rest-api-with-type-script"
```

### **Generate** CSS class names from component props

@keywords: CSS, class, component, props, BEM, design system

Convert component variant names to CSS class names.
Essential for design system components with dynamic styling.

```typescript
const getClassName = (variant: string, size: string) =>
  `btn-${kebabCase(variant)}-${kebabCase(size)}`;

getClassName("primaryOutline", "extraLarge");
// => "btn-primary-outline-extra-large"
```

### **Create** accessible anchor IDs from headings

@keywords: anchor, ID, heading, table of contents, a11y, seo

Generate URL-safe anchor IDs from heading text for table of contents.
Essential for documentation sites and blog posts with deep linking.

```typescript
const headings = ["Getting Started", "API Reference", "Error Handling Best Practices"];

const toc = headings.map((text) => ({
  text,
  id: kebabCase(text),
  href: `#${kebabCase(text)}`,
}));
// => [{ text: "Getting Started", id: "getting-started", href: "#getting-started" }, ...]
```
