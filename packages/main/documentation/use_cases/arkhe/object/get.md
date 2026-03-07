## `get` ⭐

### **Access** nested data safely 📍

@keywords: access, nested, safe, path, deep, optional-chaining

Retrieve a deeply nested value without throwing "cannot read property of undefined".
Critical for accessing API response data.

```typescript
// Safe access: returns undefined if path doesn't exist
const city = get(user, 'address.shipping.city');
```

### **Provide** default fallback

@keywords: provide, default, fallback, undefined, null, UI

Return a default value if the resolved path is `undefined` or null.
Essential for UI rendering to prevent blank states.

```typescript
const theme = get(config, 'ui.theme.color', 'blue');
```

### **Access** array elements

@keywords: access, arrays, elements, notation, path, indexing

Retrieve items from nested arrays using dot notation.
Useful for parsing JSON structures with lists.

```typescript
const firstTag = get(post, 'tags[0].name');
```

### **Read** i18n translation keys

@keywords: i18n, translation, locale, internationalization, nested, config

Retrieve translation strings from deeply nested locale objects.
Essential for internationalization systems with namespaced translation keys.

```typescript
const translations = {
  en: { auth: { login: { title: "Sign In", error: "Invalid credentials" } } },
  fr: { auth: { login: { title: "Connexion", error: "Identifiants invalides" } } },
};

const t = (key: string, locale = "en") =>
  get(translations, `${locale}.${key}`, key);

t("auth.login.title"); // => "Sign In"
t("auth.login.title", "fr"); // => "Connexion"
t("auth.signup.title"); // => "auth.signup.title" (fallback to key)
```

### **Extract** data from webhook payloads

@keywords: webhook, payload, Stripe, GitHub, nested, API, event, integration, payment

Safely extract values from deeply nested third-party webhook payloads.
Critical for Stripe, GitHub, Slack, and other webhook integrations where structure varies.

```typescript
// Stripe webhook payload — deeply nested
const stripeEvent = {
  type: "checkout.session.completed",
  data: {
    object: {
      customer_details: { email: "user@example.com", name: "Alice" },
      amount_total: 4999,
      payment_intent: { charges: { data: [{ receipt_url: "https://..." }] } },
    },
  },
};

const email = get(stripeEvent, "data.object.customer_details.email");
// => "user@example.com"

const receiptUrl = get(stripeEvent, "data.object.payment_intent.charges.data[0].receipt_url");
// => "https://..."

const refundReason = get(stripeEvent, "data.object.refund.reason", "none");
// => "none" (path doesn't exist, fallback used)
```

### **Read** design token values from a nested theme

@keywords: design, token, theme, nested, CSS, variable, design system, presets

Access deeply nested design tokens from a theme configuration.
Essential for design systems with multi-level token hierarchies.

```typescript
const theme = {
  colors: {
    primary: { 50: "#eff6ff", 500: "#3b82f6", 900: "#1e3a5f" },
    semantic: { success: "#22c55e", error: "#ef4444" },
  },
  spacing: { xs: "4px", sm: "8px", md: "16px" },
};

const primaryColor = get(theme, "colors.primary.500", "#000");
// => "#3b82f6"

const errorColor = get(theme, "colors.semantic.error", "#ff0000");
// => "#ef4444"

const missing = get(theme, "colors.accent.500", "#6b7280");
// => "#6b7280" (fallback)
```

### **Access** tree node by path in a file explorer

@keywords: tree, node, path, file, explorer, nested, design system

Navigate a nested tree structure using a dot-separated path.
Essential for file explorers, org charts, and nested menu components.

```typescript
const fileTree = {
  src: {
    components: {
      Button: { type: "file", size: 1200 },
      Dialog: { type: "file", size: 3400 },
    },
    utils: {
      helpers: { type: "file", size: 800 },
    },
  },
  tests: {
    unit: { type: "directory", children: 15 },
  },
};

const dialogNode = get(fileTree, "src.components.Dialog");
// => { type: "file", size: 3400 }

const missingNode = get(fileTree, "src.hooks.useAuth", { type: "unknown" });
// => { type: "unknown" } (fallback)
```

### **Read** stepper configuration by step index

@keywords: stepper, step, config, wizard, multi-step, design system

Access step-specific configuration from a nested stepper definition.
Perfect for multi-step forms and wizard components.

```typescript
const wizardConfig = {
  steps: [
    { label: "Account", fields: ["email", "password"], validation: { required: true } },
    { label: "Profile", fields: ["name", "avatar"], validation: { required: false } },
    { label: "Confirm", fields: [], validation: { required: true } },
  ],
};

const currentStepLabel = get(wizardConfig, `steps[${currentStep}].label`, "Unknown");
const isRequired = get(wizardConfig, `steps[${currentStep}].validation.required`, false);
```

### **Extract** analytics event properties safely

@keywords: analytics, event, properties, tracking, observability, seo

Safely extract nested properties from analytics event payloads.
Critical for tracking pipelines where event shapes vary.

```typescript
const trackEvent = (event: unknown) => {
  analytics.send({
    action: get(event, "action", "unknown"),
    category: get(event, "metadata.category", "uncategorized"),
    label: get(event, "metadata.label"),
    value: get(event, "metadata.value", 0),
    userId: get(event, "user.id"),
  });
};
```
