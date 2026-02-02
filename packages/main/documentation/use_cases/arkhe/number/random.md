## `random`

### **Generate** random numbers 📍

@keywords: generate, random, numbers, range, sampling, testing

Create a random number within a range.
Essential for game mechanics, sampling, or generating test data.
```typescript
// Random float between 0 and 1
const progress = random(0, 1);

// Random integer between 1 and 100 (use Math.floor)
const diceRoll = Math.floor(random(1, 7)); // 1-6
```

### **Pick** random array element

@keywords: pick, random, element, selection, sampling, shuffle

Select a random item from a list.
Perfect for shuffling, sampling, or "tip of the day" features.
```typescript
const randomIndex = Math.floor(random(0, quotes.length));
const dailyQuote = quotes[randomIndex];
```

### **Generate** random colors

@keywords: generate, colors, RGB, random, visualization, theming

Create random RGB values for dynamic theming or data visualization.
```typescript
const r = Math.floor(random(0, 256));
const g = Math.floor(random(0, 256));
const b = Math.floor(random(0, 256));
const color = `rgb(${r}, ${g}, ${b})`;
```
