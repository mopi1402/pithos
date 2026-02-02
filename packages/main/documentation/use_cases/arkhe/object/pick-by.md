## `pickBy`

### **Filter** properties dynamically 📍

@keywords: filter, properties, dynamic, predicate, conditional, cleanup

Create a new object with properties that satisfy a predicate function.
Useful for cleaning objects by value.
```typescript
const validOnly = pickBy(data, (val) => isValid(val));
```

### **Extract** numeric properties only

@keywords: extract, numeric, metrics, filtering, types, separation

Filter an object to keep only properties with numeric values.
Useful for separating metrics from metadata in mixed objects.

```typescript
const metrics = pickBy(stats, (value) => typeof value === 'number');
// { views: 1200, clicks: 89 } — excludes string/boolean fields
```

### **Remove** null or undefined values 📍

@keywords: remove, null, undefined, cleanup, query-params, payload

Clean up an object by removing empty properties.
Essential for generating clean query parameters or JSON payloads.

```typescript
const cleanObj = pickBy(data, (value) => value != null);
```

### **Filter available venue sections** for event booking

@keywords: events, venue, sections, seats, tickets, availability, booking, concerts

Filter venue sections to show only available areas during ticket sales.
Essential for event booking platforms managing real-time seat availability.

```typescript
const venueSection = {
  vipBox: { available: 0, price: 500, capacity: 20 },
  orchestra: { available: 45, price: 200, capacity: 150 },
  mezzanine: { available: 0, price: 150, capacity: 200 },
  balcony: { available: 89, price: 80, capacity: 300 },
  standing: { available: 150, price: 50, capacity: 500 },
};

// Show only sections with available seats
const availableSections = pickBy(venueSection, (section) => section.available > 0);
// => { orchestra: {...}, balcony: {...}, standing: {...} }

// Filter premium sections for VIP customers
const premiumSections = pickBy(venueSection, (sec) => sec.price >= 150);
// => { vipBox: {...}, orchestra: {...}, mezzanine: {...} }

// Find sections with bulk availability for group bookings
const groupFriendly = pickBy(venueSection, (sec) => sec.available >= 20);
// => { orchestra: {...}, balcony: {...}, standing: {...} }
```

