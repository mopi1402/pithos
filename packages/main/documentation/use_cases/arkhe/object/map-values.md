## `mapValues`

### **Transform Object Values** while keeping keys 📍

@keywords: transform, map, values, object, conversion

Transform all values in an object while preserving keys.
Essential for data transformation pipelines.

```typescript
import { mapValues } from "pithos/arkhe/object/map-values";

const prices = {
  apple: 1.5,
  banana: 0.75,
  orange: 2.0,
};

// Apply 10% discount to all prices
const discountedPrices = mapValues(prices, (price) => price * 0.9);
console.log(discountedPrices);
// { apple: 1.35, banana: 0.675, orange: 1.8 }

// Format as currency strings
const formatted = mapValues(prices, (price) => `$${price.toFixed(2)}`);
console.log(formatted);
// { apple: "$1.50", banana: "$0.75", orange: "$2.00" }
```

### **API Response Normalization** 📍

@keywords: API, response, normalization, data, transformation

Normalize API response data structure.
Critical for consistent data handling.

```typescript
import { mapValues } from "pithos/arkhe/object/map-values";

interface RawUser {
  first_name: string;
  last_name: string;
  created_at: string;
}

const rawUsers: Record<string, RawUser> = {
  "1": { first_name: "John", last_name: "Doe", created_at: "2024-01-15" },
  "2": { first_name: "Jane", last_name: "Smith", created_at: "2024-02-20" },
};

// Transform each user to normalized format
const users = mapValues(rawUsers, (user, id) => ({
  id,
  fullName: `${user.first_name} ${user.last_name}`,
  createdAt: new Date(user.created_at),
}));

console.log(users["1"]);
// { id: "1", fullName: "John Doe", createdAt: Date object }
```

### **Form Validation** results transformation

@keywords: form, validation, transform, errors, messages

Transform validation rules into error messages.
Important for user-friendly form feedback.

```typescript
import { mapValues } from "pithos/arkhe/object/map-values";

const fieldValues = {
  username: "ab",
  email: "invalid-email",
  password: "123",
};

const validationRules = {
  username: (v: string) => v.length >= 3 || "Username must be at least 3 characters",
  email: (v: string) => v.includes("@") || "Invalid email format",
  password: (v: string) => v.length >= 8 || "Password must be at least 8 characters",
};

// Run all validations
const errors = mapValues(validationRules, (validate, key) => {
  const result = validate(fieldValues[key]);
  return result === true ? null : result;
});

console.log(errors);
// {
//   username: "Username must be at least 3 characters",
//   email: "Invalid email format",
//   password: "Password must be at least 8 characters"
// }
```

### **Convert portfolio currencies** for trading dashboards

@keywords: bourse, trading, currency, conversion, portfolio, forex, stocks, financial

Convert all positions in a trading portfolio to a base currency.
Essential for international trading platforms and multi-currency portfolios.

```typescript
import { mapValues } from "pithos/arkhe/object/map-values";

const portfolio = {
  AAPL: { shares: 50, valueUSD: 8925.00 },
  ASML: { shares: 10, valueEUR: 7450.00 },
  TSM: { shares: 30, valueTWD: 18900.00 },
  SAP: { shares: 25, valueEUR: 4875.00 },
};

const exchangeRates = { USD: 1, EUR: 1.08, TWD: 0.031 };

// Convert all positions to USD for unified view
const portfolioUSD = mapValues(portfolio, (position, symbol) => {
  const currency = Object.keys(position).find((k) => k.startsWith("value"))?.slice(5) || "USD";
  const localValue = Object.values(position).find((v) => typeof v === "number" && v > 100) as number;
  const usdValue = localValue * (exchangeRates[currency] || 1);

  return {
    ...position,
    valueUSD: Math.round(usdValue * 100) / 100,
    currency,
  };
});

// Calculate total portfolio value
const totalUSD = Object.values(portfolioUSD).reduce((sum, p) => sum + p.valueUSD, 0);
console.log(`Portfolio total: $${totalUSD.toLocaleString()}`);
```

