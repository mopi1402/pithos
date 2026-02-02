## `memoize` ⭐

### **Cache expensive** calculations 📍

@keywords: cache, expensive, calculations, performance, optimization, memoization

Store results of expensive operations to avoid redundant computation.
Essential for performance optimization and reducing computational overhead.

```typescript
const factorial = memoize((n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

factorial(5); // Computed
factorial(5); // Cached result returned instantly
```

### **Cache API** responses 📍

@keywords: cache, API, responses, optimization, network, performance

Store API responses to avoid duplicate requests.
Critical for API optimization and reducing network traffic.

```typescript
const fetchUser = memoize(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

// Second call returns same promise/result without network request
await fetchUser("123");
await fetchUser("123"); 
```

### **Cache DOM** queries

@keywords: cache, DOM, queries, selectors, performance, optimization

Store DOM element references to avoid repeated queries.
Essential for DOM manipulation and performance optimization.

```typescript
const getElement = memoize((selector) => document.querySelector(selector));

// Only queries DOM once per selector
const btn = getElement("#submit-btn");
const btnAgain = getElement("#submit-btn"); // Cached
```

### **Cache credit score** calculations for loan processing

@keywords: financial, credit, score, cache, banking, loan, performance, calculation

Cache expensive credit score calculations to speed up loan application workflows.
Critical for banking systems processing high volumes of loan applications.

```typescript
// Credit score calculation is expensive (calls multiple APIs, runs ML models)
const calculateCreditScore = memoize(async (applicantId: string) => {
  // Aggregate data from multiple sources
  const [paymentHistory, debtRatio, creditAge, inquiries] = await Promise.all([
    creditBureau.getPaymentHistory(applicantId),
    creditBureau.getDebtRatio(applicantId),
    creditBureau.getCreditAge(applicantId),
    creditBureau.getRecentInquiries(applicantId),
  ]);

  // Complex scoring algorithm
  let score = 300;
  score += paymentHistory.onTimeRate * 200;
  score += (1 - debtRatio) * 150;
  score += Math.min(creditAge / 10, 1) * 100;
  score -= inquiries * 5;

  return Math.round(Math.min(Math.max(score, 300), 850));
});

// Same applicant checking multiple loan products - reuses cached score
const autoLoanEligibility = await checkEligibility(
  await calculateCreditScore("APP-12345"),
  "auto"
);

const mortgageEligibility = await checkEligibility(
  await calculateCreditScore("APP-12345"), // Cache hit!
  "mortgage"
);
```

