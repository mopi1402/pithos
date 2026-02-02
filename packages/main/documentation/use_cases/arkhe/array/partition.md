## `partition` ⭐

### **Separate active and inactive users** 📍

@keywords: partition, users, active, inactive, CRM

Split user lists based on status for targeted actions.
Perfect for CRM systems, email campaigns, or user analytics.

```typescript
const users = [
  { name: "Alice", isActive: true },
  { name: "Bob", isActive: false },
  { name: "Charlie", isActive: true },
  { name: "Diana", isActive: false },
];

const [activeUsers, inactiveUsers] = partition(users, (u) => u.isActive);
// activeUsers => [Alice, Charlie]
// inactiveUsers => [Bob, Diana]
```

### **Split valid and invalid form submissions** 📍

@keywords: validation, form, submissions, errors, batch processing

Separate successful entries from errors for batch handling.
Ideal for form validation, data imports, or API request processing.

```typescript
const submissions = [
  { id: "S1", email: "user1@mail.com", age: 25 },
  { id: "S2", email: "invalid-email", age: 30 },
  { id: "S3", email: "user3@mail.com", age: 17 },
  { id: "S4", email: "user4@mail.com", age: 22 },
];

const isValid = (s) => s.email.includes("@") && s.age >= 18;

const [valid, invalid] = partition(submissions, isValid);
// valid => [S1, S4]
// invalid => [S2, S3]
```

### **Categorize transactions** as income vs expenses

@keywords: transactions, income, expenses, financial, budgeting

Split financial data for budgeting and reporting.
Useful for banking apps, expense trackers, or accounting systems.

```typescript
const transactions = [
  { description: "Salary", amount: 5000 },
  { description: "Rent", amount: -1500 },
  { description: "Freelance", amount: 800 },
  { description: "Groceries", amount: -250 },
];

const [income, expenses] = partition(transactions, (t) => t.amount > 0);
// income => [Salary, Freelance]
// expenses => [Rent, Groceries]

const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
// => 5800
```

### **Separate approved** vs rejected insurance claims

@keywords: insurance, claims, approved, rejected, assurance, sinistre, processing

Split insurance claims for streamlined processing workflows.
Essential for insurance companies managing claim approvals and appeals.

```typescript
const claims = [
  { id: "CLM-001", type: "auto", amount: 5000, status: "approved", riskScore: 0.2 },
  { id: "CLM-002", type: "home", amount: 15000, status: "rejected", riskScore: 0.9 },
  { id: "CLM-003", type: "health", amount: 3200, status: "approved", riskScore: 0.3 },
  { id: "CLM-004", type: "auto", amount: 8500, status: "pending", riskScore: 0.6 },
  { id: "CLM-005", type: "home", amount: 25000, status: "rejected", riskScore: 0.85 },
];

// Separate approved claims for payment processing
const [approved, needsReview] = partition(claims, (c) => c.status === "approved");
// approved => [CLM-001, CLM-003] - Ready for payout
// needsReview => [CLM-002, CLM-004, CLM-005] - Requires further action

// Separate high-risk claims for fraud investigation
const [highRisk, standard] = partition(claims, (c) => c.riskScore > 0.7);
// highRisk => [CLM-002, CLM-005] - Flag for investigation
// standard => [CLM-001, CLM-003, CLM-004] - Normal processing
```

