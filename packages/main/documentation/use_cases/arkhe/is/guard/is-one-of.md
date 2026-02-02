## `isOneOf` 💎

> A robust type guard for verifying values against a readonly list of allowed constants.

### **Validate** string enums/unions 📍

@keywords: validate, enums, unions, constants, narrowing, allowed

Check if a string belongs to a specific set of allowed values and narrow the type.
Critical for validating API inputs or state machine transitions.

```typescript
const STATUSES = ['pending', 'active', 'done'] as const;

if (isOneOf(status, STATUSES)) {
  // status is narrowed to 'pending' | 'active' | 'done'
  updateStatus(status);
}
```

### **Guard** state machine transitions

@keywords: guard, state-machine, transitions, validation, workflow, allowed

Validate that a transition is allowed from the current state.
```typescript
const ALLOWED_FROM_PENDING = ['approved', 'rejected'] as const;

function transition(current: string, next: string) {
  if (current === 'pending' && isOneOf(next, ALLOWED_FROM_PENDING)) {
    // next is narrowed to 'approved' | 'rejected'
    return next;
  }
  throw new Error(`Invalid transition: ${current} → ${next}`);
}
```
