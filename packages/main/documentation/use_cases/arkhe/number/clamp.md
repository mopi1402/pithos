## `clamp` ⭐

### **Restrict** value range 📍

@keywords: restrict, clamp, range, bounds, limits, constrain

Constrain a number between a minimum and maximum value.
Essential for UI sliders, physical limits, or color values.

```typescript
const opacity = clamp(inputOpacity, 0, 1);
element.style.opacity = String(opacity);
console.log(`Applied opacity: ${opacity}`);
```

### **Normalize** geometric bounds

@keywords: normalize, geometric, bounds, coordinates, screen, canvas

Ensure coordinates stay within the screen or map boundaries.
Perfect for game development or canvas rendering.

```typescript
const x = clamp(player.x, 0, screenWidth);
const y = clamp(player.y, 0, screenHeight);
```

### **Limit** volume or brightness levels

@keywords: limit, volume, brightness, settings, accessibility, safety

Constrain user-adjustable settings to safe ranges.
Essential for accessibility and hardware protection.
```typescript
const volume = clamp(userVolume, 0, 100);
audioPlayer.setVolume(volume);
```

### **Enforce premium bounds** for insurance calculations

@keywords: insurance, premium, bounds, assurance, tarification, regulatory, pricing

Constrain calculated premiums within regulatory and business limits.
Critical for insurance pricing engines ensuring compliance and profitability.

```typescript
const MIN_PREMIUM = 150;    // Minimum viable premium
const MAX_PREMIUM = 25000;  // Regulatory cap

const calculateAutoInsurance = (driver) => {
  // Base premium calculation
  let premium = 500;
  premium *= driver.age < 25 ? 1.8 : 1.0;      // Young driver surcharge
  premium *= driver.accidents > 0 ? 1.5 : 1.0; // Accident history
  premium *= driver.vehicleValue / 20000;      // Vehicle value factor

  // Clamp to regulatory and business bounds
  return clamp(premium, MIN_PREMIUM, MAX_PREMIUM);
};

// Examples:
calculateAutoInsurance({ age: 22, accidents: 2, vehicleValue: 45000 });
// Calculated: 6075 => clamped to 6075 (within bounds)

calculateAutoInsurance({ age: 65, accidents: 0, vehicleValue: 8000 });
// Calculated: 100 => clamped to 150 (minimum premium)
```

