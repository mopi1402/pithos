# Strategy Pattern Demo - Pricing Calculator

Interactive demo showcasing the **Strategy Pattern** from Pithos `eidos` module.

## What it demonstrates

A pricing calculator with interchangeable discount strategies:

- **Regular** - No discount (base pricing)
- **VIP** - 20% off all items
- **Promo** - 15% seasonal discount
- **Bulk** - 25% off orders over $500

The price updates live as you switch strategies or modify quantities.

## The Pattern

Traditional OOP Strategy requires:
- An interface (`PricingStrategy`)
- Concrete classes (`RegularPricing`, `VipPricing`, etc.)
- A context class to manage strategy switching

With Pithos, it's just functions:

```ts
import { createStrategies } from "@pithos/core/eidos/strategy";

const pricingStrategies = createStrategies({
  regular: (input) => ({ total: input.subtotal }),
  vip: (input) => ({ total: input.subtotal * 0.8 }),
  promo: (input) => ({ total: input.subtotal * 0.85 }),
});

// Execute by key
pricingStrategies.execute("vip", { subtotal: 100 }); // { total: 80 }

// Or get the function
const applyVip = pricingStrategies.use("vip");
applyVip({ subtotal: 100 }); // { total: 80 }
```

## Running locally

```bash
cd packages/pithos/examples/design-patterns/strategy
pnpm install
pnpm dev
```

## Key files

- `src/lib/pricing.ts` - Strategy definitions using `createStrategies()`
- `src/components/PricingCalculator.tsx` - Main component with live updates
- `src/components/StrategySelector.tsx` - UI for switching strategies
