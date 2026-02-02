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
