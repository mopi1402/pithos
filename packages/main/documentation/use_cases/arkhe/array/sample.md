## `sample`

### **Pick a random winner** from a contest 📍

@keywords: random, winner, contest, raffle, prize

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

### **Assign A/B test variants**

@keywords: A/B testing, variants, experiment, random assignment, feature testing

Randomly assign users to experiment groups.
Useful for feature testing or split testing.

```typescript
const variants = ["control", "variant-a", "variant-b"];

const assignedVariant = sample(variants);
// => "variant-b"
```
