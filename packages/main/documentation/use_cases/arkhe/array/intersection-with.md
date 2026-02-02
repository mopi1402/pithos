## `intersectionWith`

### **Find matching coordinates** across map datasets 📍

@keywords: find, coordinates, GPS, geospatial, location, tolerance

Identify common locations with tolerance for floating-point precision.
Perfect for GPS data, geospatial analysis, or location-based services.

```typescript
const sensorAReadings = [
  { lat: 48.8566, lng: 2.3522, temp: 22 },
  { lat: 51.5074, lng: -0.1278, temp: 18 },
  { lat: 40.7128, lng: -74.006, temp: 25 },
];

const sensorBReadings = [
  { lat: 48.8567, lng: 2.3523, temp: 21 }, // ~same as Paris
  { lat: 35.6762, lng: 139.6503, temp: 28 },
  { lat: 40.7127, lng: -74.0059, temp: 24 }, // ~same as NYC
];

const TOLERANCE = 0.001;

const commonLocations = intersectionWith(
  [sensorAReadings, sensorBReadings],
  (a, b) =>
    Math.abs(a.lat - b.lat) < TOLERANCE && Math.abs(a.lng - b.lng) < TOLERANCE
);
// => [Paris, NYC locations]
```

### **Match objects with deep equality** comparison

@keywords: match, objects, equality, deep, comparison, validation

Find identical complex objects across multiple collections.
Ideal for state comparison, cache validation, or test assertions.

```typescript
const configSetA = [
  { feature: "auth", settings: { provider: "oauth", timeout: 3000 } },
  { feature: "cache", settings: { ttl: 600, maxSize: 100 } },
];

const configSetB = [
  { feature: "cache", settings: { ttl: 600, maxSize: 100 } },
  { feature: "auth", settings: { provider: "oauth", timeout: 5000 } },
];

const deepEqual = (a, b) =>
  a.feature === b.feature &&
  JSON.stringify(a.settings) === JSON.stringify(b.settings);

const identicalConfigs = intersectionWith([configSetA, configSetB], deepEqual);
// => [{ feature: "cache", settings: { ttl: 600, maxSize: 100 } }]
```

### **Find overlapping time ranges** across schedules

@keywords: find, overlapping, time, ranges, booking, scheduling

Detect common availability windows using custom range overlap logic.
Useful for booking systems, resource allocation, or shift planning.

```typescript
interface TimeSlot {
  start: number;
  end: number;
  label: string;
}

const roomASlots: TimeSlot[] = [
  { start: 9, end: 12, label: "Morning Block" },
  { start: 14, end: 17, label: "Afternoon" },
];

const roomBSlots: TimeSlot[] = [
  { start: 10, end: 13, label: "Mid-Morning" },
  { start: 15, end: 18, label: "Late Afternoon" },
];

const hasOverlap = (a: TimeSlot, b: TimeSlot): boolean => {
  const overlapStart = Math.max(a.start, b.start);
  const overlapEnd = Math.min(a.end, b.end);
  return overlapEnd - overlapStart >= 1;
};

const overlappingSlots = intersectionWith(
  [roomASlots, roomBSlots],
  hasOverlap
);
// => Slots with at least 1 hour overlap
```
