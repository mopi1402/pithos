## `unionWith`

### **Merge objects with custom equality** 📍

@keywords: merge, custom equality, deep comparison, deduplication, objects

Combine arrays using custom comparison logic.
Perfect for complex deduplication or merging objects with deep equality.

```typescript
const localUsers = [
  { email: "alice@example.com", name: "Alice" },
  { email: "bob@example.com", name: "Bob" },
];

const remoteUsers = [
  { email: "ALICE@EXAMPLE.COM", name: "Alice Smith" },
  { email: "charlie@example.com", name: "Charlie" },
];

const allUsers = unionWith(
  [localUsers, remoteUsers],
  (a, b) => a.email.toLowerCase() === b.email.toLowerCase()
);
// => [Alice, Bob, Charlie] (case-insensitive dedup)
```

### **Combine coordinates** with tolerance

@keywords: coordinates, geospatial, tolerance, location, sensor

Merge location data where "close enough" is considered equal.
Useful for geospatial data or sensor readings.

```typescript
const sensorA = [
  { lat: 48.856, lng: 2.352 },
  { lat: 51.507, lng: -0.127 },
];

const sensorB = [
  { lat: 48.857, lng: 2.353 }, // ~same as Paris
  { lat: 40.712, lng: -74.006 },
];

const TOLERANCE = 0.01;

const allLocations = unionWith([sensorA, sensorB], (a, b) =>
  Math.abs(a.lat - b.lat) < TOLERANCE && Math.abs(a.lng - b.lng) < TOLERANCE
);
// => [Paris, London, NYC]
```

### **Merge configs** with deep equality

@keywords: config, deep equality, settings, merge, deduplication

Combine configuration objects avoiding duplicates by deep comparison.
Essential for merging settings from multiple sources.

```typescript
const defaultConfig = [{ key: "theme", value: { mode: "light" } }];
const userConfig = [{ key: "theme", value: { mode: "light" } }];

const deepEqual = (a, b) =>
  a.key === b.key && JSON.stringify(a.value) === JSON.stringify(b.value);

const mergedConfig = unionWith([defaultConfig, userConfig], deepEqual);
// => [{ key: "theme", value: { mode: "light" } }] (deduplicated)
```
