## `findBest` 💎

> Finds the best item without sorting. Instead of `sort()[0]` (O(n log n)) or complex reduces, get the min/max/best item in O(n). Perfect for finding cheapest products, nearest locations, or highest-rated items with custom comparison logic.

### **Find best match** with custom criteria 📍

@keywords: find, best, optimal, comparison, cheapest, highest

Select the optimal item from a collection based on any comparable property.
Perfect for finding the cheapest product, nearest location, or highest-rated item.

```typescript
const products = [
  { name: "Laptop", price: 999, rating: 4.5 },
  { name: "Phone", price: 699, rating: 4.8 },
  { name: "Tablet", price: 449, rating: 4.2 },
];

const cheapest = findBest(
  products,
  (p) => p.price,
  (a, b) => a < b
);
// => { name: "Tablet", price: 449, rating: 4.2 }

const bestRated = findBest(
  products,
  (p) => p.rating,
  (a, b) => a > b
);
// => { name: "Phone", price: 699, rating: 4.8 }
```

### **Find nearest or furthest** element

@keywords: find, nearest, furthest, proximity, geolocation, distance

Locate items closest to or furthest from a reference point.
Essential for geolocation, scheduling, or any proximity-based searches.

```typescript
const events = [
  { name: "Meeting", date: new Date("2025-01-15") },
  { name: "Conference", date: new Date("2025-01-05") },
  { name: "Workshop", date: new Date("2025-01-22") },
];

const now = new Date("2025-01-10");

const nextEvent = findBest(
  events.filter((e) => e.date > now),
  (e) => e.date.getTime(),
  (a, b) => a < b
);
// => { name: "Meeting", date: 2025-01-15 }
```

### **Priority-based selection** with complex rules

@keywords: priority, selection, scheduling, allocation, scoring, weighted

Select items using multi-factor comparisons or business-specific logic.
Ideal for task scheduling, resource allocation, or weighted scoring systems.

```typescript
const tasks = [
  { name: "Bug fix", priority: 2, deadline: 1 },
  { name: "Feature", priority: 1, deadline: 3 },
  { name: "Refactor", priority: 3, deadline: 2 },
];

// Custom logic: lower priority number wins, then earlier deadline
const mostUrgent = findBest(
  tasks,
  (t) => t,
  (a, b) =>
    a.priority < b.priority ||
    (a.priority === b.priority && a.deadline < b.deadline)
);
// => { name: "Feature", priority: 1, deadline: 3 }
```

### **Find best matching organ donor** for transplant

@keywords: medical, organ, donor, transplant, matching, healthcare, compatibility, patient

Find the most compatible organ donor from a pool of candidates.
Critical for transplant coordination systems optimizing patient outcomes.

```typescript
type DonorMatch = {
  donorId: string;
  bloodType: string;
  hlaMatch: number;      // 0-6 antigens matched
  distance: number;       // km from recipient hospital
  organQuality: number;   // 1-10 scale
  waitTime: number;       // days recipient has waited
};

const potentialDonors: DonorMatch[] = [
  { donorId: "D001", bloodType: "O-", hlaMatch: 5, distance: 120, organQuality: 9, waitTime: 450 },
  { donorId: "D002", bloodType: "O-", hlaMatch: 6, distance: 350, organQuality: 8, waitTime: 450 },
  { donorId: "D003", bloodType: "O-", hlaMatch: 4, distance: 80, organQuality: 10, waitTime: 450 },
];

// Complex matching: prioritize HLA match, then quality, then proximity
const bestMatch = findBest(
  potentialDonors,
  (d) => d,
  (a, b) => {
    // Higher HLA match wins
    if (a.hlaMatch !== b.hlaMatch) return a.hlaMatch > b.hlaMatch;
    // Then higher organ quality
    if (a.organQuality !== b.organQuality) return a.organQuality > b.organQuality;
    // Then shorter distance
    return a.distance < b.distance;
  }
);

console.log(`Best match: ${bestMatch?.donorId} (HLA: ${bestMatch?.hlaMatch}/6)`);
// => Best match: D002 (HLA: 6/6)
```

