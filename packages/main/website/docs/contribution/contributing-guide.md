---
sidebar_position: 6
title: Contributing Guide
---

# Contributing Guide

Thank you for considering contributing to Pithos! This guide covers the practical aspects of contributing code, documentation, and improvements.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or latest LTS)
- pnpm (package manager)
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/pithos.git
cd pithos

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build
```

## 📝 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

Follow the [Design Principles](./design-principles/design-philosophy.md) when implementing features:

- **Performance first**: Measure impact on bundle size and runtime
- **TypeScript-first**: Full type inference, no `any` leaks
- **Data-first**: Consistent API across all utilities
- **Immutable by default**: Don't mutate inputs
- **Fail fast, fail loud**: Explicit errors over silent failures

### 3. Write Tests

Every feature or fix must include tests:

```typescript
import { describe, it, expect } from "vitest";
import { yourFunction } from "./your-function";

describe("yourFunction", () => {
  it("should handle the basic case", () => {
    expect(yourFunction(input)).toBe(expected);
  });

  it("should throw on invalid input", () => {
    expect(() => yourFunction(invalid)).toThrow();
  });
});
```

**Test requirements:**
- Unit tests for all functions
- Edge cases covered
- Error cases tested
- Performance tests for critical paths (if applicable)

### 4. Document Your Code

Use TSDoc comments for all public APIs:

```typescript
/**
 * Brief description of what the function does.
 *
 * @param input - Description of the parameter
 * @returns Description of the return value
 *
 * @example
 * ```typescript
 * yourFunction("example");
 * // → expected output
 * ```
 *
 * @throws {Error} When input is invalid
 */
export function yourFunction(input: string): string {
  // Implementation
}
```

### 5. Run Quality Checks

```bash
# Run tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build to verify no errors
pnpm build
```

## 🔍 Code Review Process

### What We Look For

1. **Correctness**: Does it work as intended?
2. **Performance**: Impact on bundle size and runtime
3. **Type safety**: Full TypeScript inference
4. **Tests**: Adequate coverage
5. **Documentation**: Clear TSDoc comments
6. **Consistency**: Follows existing patterns

### Review Timeline

- Initial review: Within 1-3 days
- Follow-up reviews: Within 1-2 days
- Merge: After approval and CI passes

## 📦 Pull Request Guidelines

### PR Title Format

```
type(scope): brief description

Examples:
feat(arkhe): add groupBy utility
fix(kanon): correct email validation regex
docs(zygos): improve Result examples
perf(kanon): optimize object validation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Motivation
Why is this change needed?

## Changes
- List of changes made
- Another change

## Testing
How was this tested?

## Performance Impact
- Bundle size: +X bytes / -X bytes / no change
- Runtime: benchmarks if applicable

## Breaking Changes
List any breaking changes (if applicable)
```

## 🎯 Contribution Areas

### High Priority

- Performance improvements with benchmarks
- Bug fixes with test cases
- Documentation improvements
- Type safety enhancements

### Welcome Contributions

- New utilities (with justification)
- Test coverage improvements
- Examples and use cases
- Benchmark additions

### Discuss First

- Major architectural changes
- Breaking changes
- New modules
- Large refactors

Open an issue to discuss before implementing.

## 🧪 Testing Strategy

See [Testing Strategy](../basics/testing-strategy.md) for detailed testing philosophy.

**Key points:**
- Unit tests for all functions
- Integration tests for complex flows
- Performance benchmarks for critical paths
- Mutation testing for high-value code

## 📊 Performance Benchmarks

When adding or modifying performance-critical code:

```bash
# Run benchmarks
cd packages/kanon/benchmarks
pnpm bench

# Compare with baseline
pnpm bench:compare
```

Include benchmark results in your PR if performance is affected.

## 🐛 Reporting Issues

### Bug Reports

Include:
- Minimal reproduction
- Expected behavior
- Actual behavior
- Environment (Node version, OS, etc.)

### Feature Requests

Include:
- Use case description
- Proposed API
- Why existing utilities don't solve this
- Performance considerations

## 📚 Documentation Contributions

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples
- Improve API documentation
- Add use cases

Documentation lives in:
- TSDoc comments (inline with code)
- `packages/main/website/docs/` (user-facing docs)
- `packages/main/website/docs/400-contribution/` (contributor docs)

## 🤝 Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Welcome newcomers
- Assume good intentions

## 💬 Getting Help

- Open an issue for questions
- Check existing documentation
- Review similar PRs for patterns

---

Thank you for contributing to Pithos! Every contribution, no matter how small, helps make the library better for everyone.
