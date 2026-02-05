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

@keywords: webhook, payload, Stripe, GitHub, nested, API, event, integration

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
