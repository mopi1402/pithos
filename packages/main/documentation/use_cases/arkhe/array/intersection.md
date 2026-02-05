## `intersection`

### **Find common permissions** across user roles 📍

@keywords: find, common, permissions, roles, access, authorization

Identify shared access rights between multiple roles or user groups.
Perfect for permission systems, access control, or role-based authorization.

```typescript
const adminPermissions = ["read", "write", "delete", "admin", "audit"];
const editorPermissions = ["read", "write", "publish", "audit"];
const viewerPermissions = ["read", "comment", "audit"];

const commonPermissions = intersection(
  adminPermissions,
  editorPermissions,
  viewerPermissions
);
// => ["read", "audit"]
```

### **Filter available time slots** for scheduling

@keywords: filter, timeslots, scheduling, availability, calendar, meetings

Find overlapping availability across multiple participants for meetings.
Ideal for calendar apps, booking systems, or team scheduling tools.

```typescript
const aliceSlots = ["09:00", "10:00", "11:00", "14:00", "15:00"];
const bobSlots = ["10:00", "11:00", "13:00", "14:00", "16:00"];
const charlieSlots = ["08:00", "10:00", "14:00", "15:00", "17:00"];

const availableForAll = intersection(aliceSlots, bobSlots, charlieSlots);
// => ["10:00", "14:00"]
```

### **Identify common tags** across items

@keywords: identify, tags, common, attributes, recommendation, filtering

Find shared attributes between products, articles, or any tagged entities.
Useful for recommendation engines, filtering systems, or content analysis.

```typescript
const article1Tags = ["javascript", "typescript", "react", "frontend"];
const article2Tags = ["typescript", "nodejs", "backend", "react"];
const article3Tags = ["react", "typescript", "testing", "jest"];

const commonTags = intersection(article1Tags, article2Tags, article3Tags);
// => ["typescript", "react"]
```

### **Resolve active feature flags** for a user

@keywords: feature, flags, A/B testing, segments, rollout, toggle, experiment

Find which features are enabled for a user by intersecting their segments with active flags.
Essential for feature flag systems, gradual rollouts, and A/B testing platforms.

```typescript
const userSegments = ["beta-testers", "premium", "eu-region"];
const betaFeatures = ["new-dashboard", "ai-search"];
const premiumFeatures = ["ai-search", "export-pdf", "priority-support"];
const euFeatures = ["gdpr-banner", "cookie-consent", "ai-search"];

// Features available to ALL of the user's segments
const universalFeatures = intersection(betaFeatures, premiumFeatures, euFeatures);
// => ["ai-search"]
```

### **Find compatible filter options** in faceted search

@keywords: faceted, search, filters, compatible, options, ecommerce, catalog

Determine which filter values remain valid when multiple filters are combined.
Critical for e-commerce product filtering where options narrow down as filters are applied.

```typescript
// Products available in size "M"
const sizeMColors = ["red", "blue", "green", "black"];
// Products available in brand "Nike"
const nikeColors = ["blue", "black", "white"];
// Products available under $50
const budgetColors = ["red", "blue", "black", "yellow"];

// Colors available for: size M + Nike + under $50
const availableColors = intersection(sizeMColors, nikeColors, budgetColors);
// => ["blue", "black"]
```
