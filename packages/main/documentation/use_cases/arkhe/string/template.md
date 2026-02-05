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

@keywords: email, notification, render, dynamic, message, transactional

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

@keywords: error, message, format, context, debug, logging

Inject runtime context into error message templates for clearer debugging.

```typescript
const errorTemplates = {
  NOT_FOUND: 'Resource {resource} with id {id} not found.',
  RATE_LIMIT: 'Rate limit exceeded for {endpoint}. Retry after {retryAfter}s.',
};

const msg = template(errorTemplates.NOT_FOUND, { resource: 'User', id: '42' });
// 'Resource User with id 42 not found.'
```
