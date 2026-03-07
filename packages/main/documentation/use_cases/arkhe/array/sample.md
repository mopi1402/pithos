## `sample`

### **Pick a random winner** from a contest 📍

@keywords: random, winner, contest, raffle, prize, gaming

Select a lucky participant for prizes or rewards.
Perfect for raffles, sweepstakes, or promotional campaigns.

```typescript
const contestants = [
  { id: "P1", name: "Alice" },
  { id: "P2", name: "Bob" },
  { id: "P3", name: "Charlie" },
  { id: "P4", name: "Diana" },
];

const winner = sample(contestants);
// => { id: "P3", name: "Charlie" }

console.log(`🎉 Congratulations ${winner?.name}!`);
```

### **Display a random tip or quote**

@keywords: random tip, quote, dynamic content, engagement, onboarding

Show dynamic content to keep users engaged.
Ideal for onboarding screens, dashboards, or loading states.

```typescript
const tips = [
  "Break large tasks into smaller chunks.",
  "Use keyboard shortcuts to speed up your workflow.",
  "Take a 5-minute break every 25 minutes.",
  "Start your day with the most challenging task.",
];

const dailyTip = sample(tips);
// => "Start your day with the most challenging task."
```

### **Pick** a random placeholder image

@keywords: placeholder, random, image, fallback, UI, design system

Select a random placeholder when no image is available.
Adds visual variety to empty states and fallback content.

```typescript
const placeholders = [
  "/img/placeholder-landscape.svg",
  "/img/placeholder-abstract.svg",
  "/img/placeholder-gradient.svg",
];

const fallbackImage = sample(placeholders);
// => "/img/placeholder-abstract.svg"
```

### **Pick** a random loading message

@keywords: loading, message, random, UX, engagement, design system, loading

Show a different loading message each time to keep users engaged.
Perfect for loading screens, splash pages, and progress indicators.

```typescript
const loadingMessages = [
  "Brewing your data...",
  "Almost there...",
  "Crunching the numbers...",
  "Fetching the good stuff...",
  "Warming up the servers...",
];

const LoadingScreen = () => (
  <div className="loading">
    <Spinner />
    <p>{sample(loadingMessages)}</p>
  </div>
);
```

### **Select** a random featured item for homepage

@keywords: featured, homepage, spotlight, random, marketing, seo

Rotate featured content on the homepage without manual curation.
Essential for marketplaces, blogs, and content platforms.

```typescript
const featuredProducts = [
  { id: "p1", name: "Pro Headphones", image: "/img/headphones.jpg" },
  { id: "p2", name: "Smart Watch", image: "/img/watch.jpg" },
  { id: "p3", name: "Wireless Speaker", image: "/img/speaker.jpg" },
];

const spotlight = sample(featuredProducts);
renderHeroBanner(spotlight);
```
