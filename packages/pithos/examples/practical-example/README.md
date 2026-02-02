# Practical Example - User Dashboard

This is the example project from the [Pithos documentation](http://localhost:3000/guide/basics/practical-example/).

A user dashboard that demonstrates how to combine multiple Pithos modules:

- **Kanon** → Schema validation for API responses
- **Arkhe** → Data transformation utilities (`capitalize`, `groupBy`)
- **Zygos** → Type-safe error handling with `ResultAsync`

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard/       # Main dashboard components
│   └── ui/              # shadcn-style UI components
├── hooks/
│   └── useDashboard.ts  # React hook with Pithos pipeline
├── lib/
│   ├── api.ts           # Safe API helpers with Zygos
│   ├── schemas.ts       # Kanon validation schemas
│   ├── transformers.ts  # Arkhe data transformations
│   ├── types.ts         # TypeScript types
│   └── mock-data.ts     # Demo data
└── App.tsx
```

## Key Concepts Demonstrated

1. **Schema Validation** - `DashboardSchema` validates API responses
2. **Data Transformation** - `formatUser()` and `formatPosts()` use Arkhe utilities
3. **Error Handling** - The pipeline handles network errors, validation failures, and transforms gracefully
4. **Type Safety** - Full TypeScript inference from schema to UI
