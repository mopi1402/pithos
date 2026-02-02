## `uniqueId`

### **React list keys** for dynamic content 📍

@keywords: React, keys, list, dynamic, rendering

Generate unique keys for dynamically created list items.
Essential when items lack natural unique identifiers.

```typescript
items.map(item => <Card key={uniqueId('card_')} {...item} />);
// Keys: 'card_1', 'card_2', 'card_3'...
```

### **Accessible form elements** with unique IDs 📍

@keywords: accessible, form, ID, label, a11y, WCAG

Create unique IDs for form elements to associate labels.
Critical for accessibility compliance.

```typescript
const id = uniqueId('field_');
<label htmlFor={id}>Email</label>
<input id={id} type="email" />
```

### **Temporary entity IDs** before server persistence

@keywords: temporary, entity, ID, optimistic, update

Create temporary IDs for optimistic updates before server assigns real IDs.

```typescript
const tempId = uniqueId('temp_');
todos.push({ id: tempId, text, pending: true });
// Replace with real ID after API response
```
