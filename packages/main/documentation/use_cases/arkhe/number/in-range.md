## `inRange`

### **Check** numeric boundaries 📍

@keywords: check, range, boundaries, validation, inclusive, exclusive

Verify if a number falls within a specific range (min inclusive, max exclusive).
Essential for hit detection, categorization, or validation.

```typescript
if (inRange(age, 18, 65)) {
  grantAccess();
}
```

### **Validate** indices

@keywords: validate, indices, array, bounds, safety, access

Ensure an array index is valid before accessing.
Useful for safe array operations.

```typescript
if (inRange(index, 0, items.length)) {
  processItem(items[index]);
}
```

### **Detect heart rate zones** for fitness training

@keywords: sports, fitness, heart rate, zones, training, athletes, cardio, wearable

Determine training intensity zones based on heart rate during workouts.
Essential for fitness apps, sports wearables, and athletic training programs.

```typescript
const getHeartRateZone = (bpm: number, maxHR: number) => {
  const percentage = (bpm / maxHR) * 100;

  if (inRange(percentage, 50, 60)) return { zone: 1, name: "Recovery", color: "gray" };
  if (inRange(percentage, 60, 70)) return { zone: 2, name: "Fat Burn", color: "blue" };
  if (inRange(percentage, 70, 80)) return { zone: 3, name: "Cardio", color: "green" };
  if (inRange(percentage, 80, 90)) return { zone: 4, name: "Threshold", color: "orange" };
  if (inRange(percentage, 90, 100)) return { zone: 5, name: "VO2 Max", color: "red" };

  return { zone: 0, name: "Rest", color: "white" };
};

// For a 30-year-old athlete (max HR = 220 - 30 = 190)
const maxHR = 190;
getHeartRateZone(145, maxHR); // => { zone: 3, name: "Cardio", color: "green" }
getHeartRateZone(175, maxHR); // => { zone: 5, name: "VO2 Max", color: "red" }

// Live monitoring during workout
wearable.on("heartbeat", (bpm) => {
  const zone = getHeartRateZone(bpm, maxHR);
  updateZoneDisplay(zone);
});
```

