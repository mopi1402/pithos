## `memoize` ⭐

### **Cache expensive** calculations 📍

@keywords: cache, expensive, calculations, performance, optimization, memoization

Store results of expensive operations to avoid redundant computation.
Essential for performance optimization and reducing computational overhead.

```typescript
const factorial = memoize((n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

factorial(5); // Computed
factorial(5); // Cached result returned instantly
```

### **Cache API** responses 📍

@keywords: cache, API, responses, optimization, network, performance

Store API responses to avoid duplicate requests.
Critical for API optimization and reducing network traffic.

```typescript
const fetchUser = memoize(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

// Second call returns same promise/result without network request
await fetchUser("123");
await fetchUser("123"); 
```

### **Cache DOM** queries

@keywords: cache, DOM, queries, selectors, performance, optimization

Store DOM element references to avoid repeated queries.
Best suited for elements that remain in the DOM throughout the page lifecycle.

```typescript
const getElement = memoize((selector: string) => document.querySelector(selector));

// Only queries DOM once per selector
const btn = getElement("#submit-btn");
const btnAgain = getElement("#submit-btn"); // Cached

// ⚠️ Cached references become stale if elements are removed/re-added to the DOM
```

### **Cache credit score** calculations for loan processing

@keywords: financial, credit, score, cache, banking, loan, performance, calculation

Cache expensive credit score calculations to speed up loan application workflows.
Critical for banking systems processing high volumes of loan applications.

```typescript
// Credit score calculation is expensive (calls multiple APIs, runs ML models)
const calculateCreditScore = memoize(async (applicantId: string) => {
  // Aggregate data from multiple sources
  const [paymentHistory, debtRatio, creditAge, inquiries] = await Promise.all([
    creditBureau.getPaymentHistory(applicantId),
    creditBureau.getDebtRatio(applicantId),
    creditBureau.getCreditAge(applicantId),
    creditBureau.getRecentInquiries(applicantId),
  ]);

  // Complex scoring algorithm
  let score = 300;
  score += paymentHistory.onTimeRate * 200;
  score += (1 - debtRatio) * 150;
  score += Math.min(creditAge / 10, 1) * 100;
  score -= inquiries * 5;

  return Math.round(Math.min(Math.max(score, 300), 850));
});

// Same applicant checking multiple loan products - reuses cached score
const autoLoanEligibility = await checkEligibility(
  await calculateCreditScore("APP-12345"),
  "auto"
);

const mortgageEligibility = await checkEligibility(
  await calculateCreditScore("APP-12345"), // Cache hit!
  "mortgage"
);
```


### **Cache** parsed templates or markdown

@keywords: cache, parse, template, markdown, regex, SSR, rendering, compilation, performance

Avoid re-parsing the same template or markdown content on every render.
Important for SSR, documentation sites, and any repeated content transformation.

```typescript
const parseMarkdown = memoize((source: string) => {
  // Expensive: tokenize, parse AST, render HTML
  return markdownCompiler.render(source);
});

// Same content parsed once, cached for subsequent renders
const html1 = parseMarkdown(readmeContent); // Parsed
const html2 = parseMarkdown(readmeContent); // Cache hit
```

### **Cache** responsive breakpoint calculations

@keywords: cache, breakpoint, responsive, media, query, design system, performance

Memoize breakpoint detection to avoid recalculating on every render.
Essential for design systems with JS-driven responsive behavior.

```typescript
const getBreakpoint = memoize((width: number) => {
  if (width < 640) return "sm";
  if (width < 1024) return "md";
  if (width < 1440) return "lg";
  return "xl";
});

// Same width returns cached result
const bp = getBreakpoint(window.innerWidth);
```

### **Cache** media query match results

@keywords: cache, media, query, match, responsive, design system, performance

Memoize MediaQueryList creation to avoid constructing duplicate objects.
Essential for CDK-style BreakpointObserver implementations.

```typescript
const getMediaQuery = memoize((query: string) => window.matchMedia(query));

// Same query returns cached MediaQueryList — use .matches for current state
const mql = getMediaQuery("(min-width: 1024px)");
console.log(mql.matches); // Always reads live value from the cached MediaQueryList
mql.addEventListener("change", (e) => console.log("Changed:", e.matches));
```

### **Cache** computed overlay positions

@keywords: cache, overlay, position, computed, tooltip, design system, performance

Cache the result of expensive config or schema parsing that won't change at runtime.
Perfect for parsing design tokens, theme definitions, or static configuration.

```typescript
const parseThemeTokens = memoize((themeJson: string) => {
  const raw = JSON.parse(themeJson);
  // Expensive: resolve aliases, compute derived values, flatten nested tokens
  return resolveTokenAliases(raw);
});

// Same theme string parsed once, cached for subsequent reads
const tokens = parseThemeTokens(rawTheme); // Parsed
const again = parseThemeTokens(rawTheme);  // Cache hit
```

### **Cache** i18n date formatters per locale

@keywords: cache, i18n, date, formatter, locale, internationalization, performance

Create and cache Intl.DateTimeFormat instances per locale to avoid repeated construction.
Critical for i18n-heavy apps rendering many formatted dates.

```typescript
const getDateFormatter = memoize((locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Formatter created once per locale, reused across renders
getDateFormatter("fr-FR").format(new Date()); // "10 juin 2025"
getDateFormatter("fr-FR").format(anotherDate); // Cache hit on formatter
```
