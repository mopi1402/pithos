## `pipe` ⭐

### **Function composition** and chaining 📍

@keywords: composition, chaining, functional, pipeline, transformation, flow

Pass a value through multiple functions in a readable left-to-right manner.
Essential for functional programming and clean data processing workflows.

```typescript
const add = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

const result = pipe(2, add, double, square);
// pipe(2, add, double, square) → add(2)=3 → double(3)=6 → square(6)=36
// => 36
```

### **Data transformation** pipelines

@keywords: transformation, pipelines, processing, ETL, data, flow, scripts

Transform data through multiple steps with type-safe function chaining.
Essential for complex data processing and ETL operations.

```typescript
const slug = pipe(
  "  Hello World  ",
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, "-"),
);
// => "hello-world"
```

### **Process** API response through a full pipeline

@keywords: API, response, pipeline, fetch, parse, normalize, filter, processing, performance

Chain parse, normalize, and filter steps into a single readable pipeline.
The real-world pattern developers write daily when consuming API data.

```typescript
const response = await fetch("/api/users");
const data = await response.json();

const activeUsers = pipe(
  data.users as User[],
  (users) => users.filter((u) => u.isActive),
  (users) => users.map((u) => ({ id: u.id, name: u.name, email: u.email })),
);
// Raw array → filtered active → picked fields
```

### **Build** an SEO slug from a title

@keywords: SEO, slug, pipeline, URL, normalize, deburr, seo, i18n

Chain deburr, lowercase, and cleanup into a single slug generator.
Essential for CMS platforms and blog engines generating URL-friendly slugs.

```typescript
const slug = pipe(
  "Café Résumé — Été 2025",
  (s) => deburr(s),
  (s) => s.toLowerCase(),
  (s) => s.replace(/[^a-z0-9\s]/g, ""),
  (s) => s.trim().replace(/\s+/g, "-"),
);
// => "cafe-resume-ete-2025"
```

### **Process** form submission through validation and sanitization

@keywords: form, submission, validation, sanitization, pipeline, security, a11y

Chain sanitization and transformation steps for form data.
Critical for secure form handling with clear, composable steps.

```typescript
const clean = pipe(
  { name: " Alice ", email: " Alice@Mail.COM ", message: "<b>Hello</b>" },
  (data) => ({
    ...data,
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
  }),
  (data) => {
    if (!data.email.includes("@")) throw new Error("Invalid email");
    return data;
  },
  (data) => ({
    ...data,
    message: escape(data.message),
  }),
);
// => { name: "Alice", email: "alice@mail.com", message: "&lt;b&gt;Hello&lt;/b&gt;" }
```
