## `template` 💎

> Lightweight string interpolation with support for nested paths (`{user.name}`). No regex complexity, no external dependencies.


### **Interpolate** dynamic strings 📍

@keywords: interpolate, template, placeholders, i18n, localization, dynamic

Replace placeholders in a string with data values.
Perfect for localization (i18n) or generating dynamic messages.

```typescript
const msg = template('Welcome, {user.name}!', { user: { name: 'Alice' } });
// 'Welcome, Alice!'
```

### **Render** email notifications

@keywords: email, notification, render, dynamic, message, transactional, scripts, payment

Build transactional email bodies from templates and user data.
Avoids manual string concatenation and keeps templates readable.

```typescript
const emailBody = template(
  'Hi {name}, your order #{orderId} has been {status}. Track it at {trackingUrl}.',
  { name: 'Alice', orderId: '8842', status: 'shipped', trackingUrl: 'https://track.example.com/8842' }
);
// 'Hi Alice, your order #8842 has been shipped. Track it at https://track.example.com/8842.'
```

### **Format** error messages with context

@keywords: error, message, format, context, debug, logging, observability

Inject runtime context into error message templates for clearer debugging.

```typescript
const errorTemplates = {
  NOT_FOUND: 'Resource {resource} with id {id} not found.',
  RATE_LIMIT: 'Rate limit exceeded for {endpoint}. Retry after {retryAfter}s.',
};

const msg = template(errorTemplates.NOT_FOUND, { resource: 'User', id: '42' });
// 'Resource User with id 42 not found.'
```

### **Generate** SEO meta tags from page data

@keywords: SEO, meta, tags, title, description, template, seo, performance

Build dynamic meta titles and descriptions from page data.
Essential for SSR apps and static site generators optimizing for search engines.

```typescript
const metaTitle = template("{siteName} | {pageTitle}", {
  siteName: "My Store",
  pageTitle: "Running Shoes",
});
// => "My Store | Running Shoes"

const metaDescription = template(
  "Buy {productName} at {price}. {category} with free shipping on orders over {freeShippingMin}.",
  { productName: "Nike Air Max", price: "$129", category: "Running Shoes", freeShippingMin: "$75" }
);
```

### **Build** notification messages for multiple channels

@keywords: notification, message, channel, push, SMS, template, PWA, observability

Generate notification text for push, SMS, and in-app from a single template.
Perfect for multi-channel notification systems.

```typescript
const templates = {
  push: "{userName}, your order #{orderId} is {status}!",
  sms: "Order #{orderId} {status}. Track: {trackingUrl}",
  inApp: "Your order #{orderId} has been {status}. Check details.",
};

const data = { userName: "Alice", orderId: "4521", status: "shipped", trackingUrl: "https://track.co/4521" };

const pushMsg = template(templates.push, data);
const smsMsg = template(templates.sms, data);
const inAppMsg = template(templates.inApp, data);
```
