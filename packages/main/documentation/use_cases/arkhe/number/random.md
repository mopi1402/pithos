## `random`

### **Generate** random numbers 📍

@keywords: generate, random, numbers, range, sampling, testing, gaming, 3D, canvas

Create a random number within a range.
Essential for game mechanics, sampling, or generating test data.
```typescript
// Random float between 0 and 1
const progress = random(0, 1);

// Random integer between 1 and 100 (use Math.floor)
const diceRoll = Math.floor(random(1, 7)); // 1-6
```

### **Pick** random array element

@keywords: pick, random, element, selection, sampling, shuffle, gaming

Select a random item from a list.
Perfect for shuffling, sampling, or "tip of the day" features.
```typescript
const randomIndex = Math.floor(random(0, quotes.length));
const dailyQuote = quotes[randomIndex];
```

### **Generate** random colors

@keywords: generate, colors, RGB, random, visualization, theming, canvas, design system

Create random RGB values for dynamic theming or data visualization.
```typescript
const r = Math.floor(random(0, 256));
const g = Math.floor(random(0, 256));
const b = Math.floor(random(0, 256));
const color = `rgb(${r}, ${g}, ${b})`;
```

### **Spawn** particles at random positions

@keywords: particles, spawn, canvas, animation, effects, gaming, 3D

Generate random positions and velocities for particle systems.
Essential for confetti effects, explosions, and ambient animations.

```typescript
const spawnParticle = () => ({
  x: random(0, canvas.width),
  y: random(0, canvas.height),
  vx: random(-2, 2),
  vy: random(-3, -1),
  size: random(2, 8),
  life: random(30, 90),
});

const particles = times(50, spawnParticle);
```

### **Generate** random loot drops in a game

@keywords: loot, drop, rarity, RPG, gaming, probability, reward

Roll random values to determine item rarity and stats.
Perfect for RPGs, gacha systems, and reward mechanics.

```typescript
const rollLoot = () => {
  const rarityRoll = random(0, 100);
  const rarity =
    rarityRoll < 1 ? "legendary" :
    rarityRoll < 10 ? "epic" :
    rarityRoll < 30 ? "rare" : "common";

  const damage = Math.floor(random(10, 50) * (rarityRoll / 25));

  return { rarity, damage, id: uniqueId("item-") };
};

const droppedItem = rollLoot();
// => { rarity: "rare", damage: 42, id: "item-1" }
```
