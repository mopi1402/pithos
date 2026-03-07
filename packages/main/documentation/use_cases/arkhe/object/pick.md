## `pick` ⭐

### **Select** specific subsets 📍

@keywords: select, subset, pick, DTO, whitelist, payload, presets

Create a shallow copy containing only the specified keys.
Critical for creating strict DTOs or filtering API payloads.

```typescript
const payload = pick(formData, ['username', 'email']);
```

### **Extract** form subset for validation

@keywords: extract, forms, validation, subset, multi-step, schema

Select only the fields relevant to a specific validation step.
Useful for multi-step forms or partial schema validation.

```typescript
const step1Data = pick(formData, ['firstName', 'lastName', 'email']);
const isValid = validateStep1Schema(step1Data);
```

### **Whitelist** allowed parameters

@keywords: whitelist, security, parameters, mass-assignment, validation, safe, payment, filters

Ensure that only permitted keys are passed to a function or API.
Security critical for preventing mass assignment vulnerabilities.

```typescript
const safeInput = pick(req.body, ['title', 'content', 'authorId']);
db.create(safeInput);
```

### **Extract** safe fields for logging

@keywords: logging, safe, fields, sanitize, sensitive, PII, audit, observability, ci/cd

Pick only non-sensitive fields before writing to logs.
Critical for compliance (GDPR, HIPAA) and preventing PII leaks in log systems.

```typescript
const request = {
  userId: "u-123",
  endpoint: "/api/checkout",
  method: "POST",
  creditCard: "4111-1111-1111-1111",
  ip: "192.168.1.1",
  timestamp: 1703001200,
};

const safeLog = pick(request, ["userId", "endpoint", "method", "timestamp"]);
logger.info("API request", safeLog);
// Logs: { userId: "u-123", endpoint: "/api/checkout", method: "POST", timestamp: 1703001200 }
// Credit card and IP never reach the logs
```

### **Build** chart dataset from raw records

@keywords: chart, dataset, extract, fields, visualization, charts, dashboard

Extract only the fields needed for chart rendering from complex records.
Essential for transforming API data into chart-compatible formats.

```typescript
const salesRecords = [
  { id: 1, product: "Widget", revenue: 5000, cost: 2000, date: "2025-01", region: "EU" },
  { id: 2, product: "Gadget", revenue: 8000, cost: 3500, date: "2025-02", region: "US" },
];

const chartData = salesRecords.map((r) => pick(r, ["date", "revenue", "cost"]));
// => [{ date: "2025-01", revenue: 5000, cost: 2000 }, ...]
renderBarChart(chartData);
```

### **Extract** preset fields for saving user preferences

@keywords: preset, save, preferences, user, settings, presets, design system

Pick only the saveable fields from a large settings object.
Perfect for saving user presets without storing transient UI state.

```typescript
const fullSettings = {
  theme: "dark",
  fontSize: 16,
  language: "fr",
  sidebarOpen: true,
  lastVisitedPage: "/dashboard",
  unsavedChanges: true,
};

const presetData = pick(fullSettings, ["theme", "fontSize", "language"]);
// => { theme: "dark", fontSize: 16, language: "fr" }
localStorage.setItem("user-preset", JSON.stringify(presetData));
```
