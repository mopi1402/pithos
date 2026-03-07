## `pickBy`

### **Filter** properties dynamically 📍

@keywords: filter, properties, dynamic, predicate, conditional, cleanup, filters

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

@keywords: remove, null, undefined, cleanup, query-params, payload, seo, filters

Clean up an object by removing empty properties.
Essential for generating clean query parameters or JSON payloads.

```typescript
const cleanObj = pickBy(data, (value) => value != null);
```

### **Filter available venue sections** for event booking

@keywords: events, venue, sections, seats, tickets, availability, booking, concerts, payment

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


### **Filter** visible table columns by user preference

@keywords: table, columns, visible, preference, data, design system, panels

Pick only the columns the user has chosen to display in a data table.
Essential for data table components with column visibility toggles.

```typescript
const allColumns = {
  name: { label: "Name", visible: true, width: 200 },
  email: { label: "Email", visible: true, width: 250 },
  role: { label: "Role", visible: false, width: 120 },
  status: { label: "Status", visible: true, width: 100 },
  lastLogin: { label: "Last Login", visible: false, width: 180 },
  createdAt: { label: "Created", visible: false, width: 150 },
};

const visibleColumns = pickBy(allColumns, (col) => col.visible);
// => { name: {...}, email: {...}, status: {...} }

renderTableHeaders(Object.values(visibleColumns));
```

### **Extract** enabled feature flags

@keywords: feature, flags, enabled, config, toggle, filters, design system

Pick only the enabled features from a feature flag configuration.
Essential for feature flag systems and conditional rendering.

```typescript
const featureFlags = {
  darkMode: true,
  newDashboard: false,
  betaSearch: true,
  legacyNav: false,
  aiAssistant: true,
};

const enabledFeatures = pickBy(featureFlags, (enabled) => enabled);
// => { darkMode: true, betaSearch: true, aiAssistant: true }

const featureList = Object.keys(enabledFeatures);
// => ["darkMode", "betaSearch", "aiAssistant"]
```

### **Filter** chart series with data

@keywords: chart, series, data, filter, visualization, charts, dashboard

Keep only chart series that have actual data points to display.
Perfect for dynamic dashboards where some metrics may be empty.

```typescript
const chartSeries = {
  revenue: [100, 200, 300],
  expenses: [80, 150, 250],
  refunds: [],
  taxes: [10, 20, 30],
  bonuses: [],
};

const activeSeries = pickBy(chartSeries, (values) => values.length > 0);
// => { revenue: [...], expenses: [...], taxes: [...] }
renderMultiLineChart(activeSeries);
```
