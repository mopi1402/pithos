---
sidebar_position: 1
title: Overview
---

# Contributing to Pithos

Welcome to the Pithos contribution guide. This section explains how the library is built, the architectural decisions behind each module, and how you can contribute.

## 📚 What's in this section?

### Design Principles

Core rules that guide all technical decisions across Pithos:

- Error handling philosophy
- Immutability patterns
- TypeScript-first approach
- Data-first paradigm
- API design conventions
- Performance & bundle size priorities
- Documentation standards

These principles apply to **all modules** and ensure consistency across the ecosystem.

### Module-Specific Documentation

Each module has its own documentation based on its complexity and specific needs:

- **Kanon**: Detailed architecture evolution (V1→V2→V3), innovations tested and abandoned, complete feature set
- **Other modules**: Documentation added as needed, reflecting real complexity

The structure is **organic** — modules grow their documentation naturally rather than following a rigid template.

### Contributing Guide

Practical information for contributors:

- How to submit PRs
- Testing requirements
- Code conventions
- Review process

## 🎯 Philosophy

> _"The need guides me. Technology follows."_

Everything in Pithos stems from this principle. We don't choose a technology because it's trendy — we choose it because it solves a real problem.

**Priority hierarchy:**
1. **User Experience (UX)** — Performance, bundle size, time to interactive
2. **Developer Experience (DX)** — Intuitive API, clear docs, explicit errors
3. **Pragmatism** — Smart compromises where it matters

See [Core Philosophy](../basics/core-philosophy.md) for the foundational vision.

## 🔍 How to navigate

- **New contributors**: Start with [Design Principles](./design-principles/design-philosophy.md) to understand the rules
- **Curious about a module**: Check if it has specific documentation (e.g., `kanon/`)
- **Ready to contribute**: Read the [Contributing Guide](./contributing-guide.md)

## 💡 Why this matters

Understanding the "why" behind architectural decisions helps you:

- Make consistent contributions
- Propose improvements that align with project goals
- Understand trade-offs and constraints
- Learn patterns applicable to your own projects

---

Ready to dive in? Start with [Design Principles](./design-principles/design-philosophy.md) or explore a specific module.
