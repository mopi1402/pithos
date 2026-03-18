---
title: "Abstract Factory Pattern in TypeScript"
sidebar_label: "Abstract Factory"
description: "Learn how to implement the Abstract Factory design pattern in TypeScript with functional programming. Create families of related objects without specifying concrete types."
keywords:
  - abstract factory typescript
  - factory pattern
  - object families
  - theme factory
  - cross-platform ui
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Abstract Factory Pattern

Provide a single entry point for creating families of related objects without coupling to their concrete types.

---

## The Problem

You're building a cross-platform UI kit. Each platform (iOS, Android, Web) needs its own button, input, and modal. But the form logic shouldn't care which platform it's running on.

The naive approach:

```typescript
function createButton(platform: string, label: string) {
  if (platform === "ios") return { type: "UIButton", label, style: "rounded" };
  if (platform === "android") return { type: "MaterialButton", label, style: "elevated" };
  if (platform === "web") return { type: "button", label, style: "outlined" };
}

function createInput(platform: string, placeholder: string) {
  if (platform === "ios") return { type: "UITextField", placeholder };
  // ... same pattern repeated for every component
}
```

Platform checks in every factory. Easy to mix iOS buttons with Android inputs. Adding a new platform means updating every function.

---

## The Solution

Group related factories into families. Pick the platform once, get a consistent kit:

```typescript
import { createAbstractFactory } from "@pithos/core/eidos/abstract-factory/abstract-factory";

type UIKit = {
  button: (label: string) => UIElement;
  input: (placeholder: string) => UIElement;
  modal: (title: string, content: string) => UIElement;
};

const uiFactory = createAbstractFactory<"ios" | "android" | "web", UIKit>({
  ios: () => ({
    button: (label) => ({ tag: "UIButton", label, radius: 12 }),
    input: (ph) => ({ tag: "UITextField", placeholder: ph, border: "none" }),
    modal: (title, content) => ({ tag: "UIAlert", title, content }),
  }),
  android: () => ({
    button: (label) => ({ tag: "MaterialButton", label, elevation: 4 }),
    input: (ph) => ({ tag: "TextInput", placeholder: ph, underline: true }),
    modal: (title, content) => ({ tag: "AlertDialog", title, content }),
  }),
  web: () => ({
    button: (label) => ({ tag: "button", label, className: "btn" }),
    input: (ph) => ({ tag: "input", placeholder: ph, className: "form-input" }),
    modal: (title, content) => ({ tag: "dialog", title, content }),
  }),
});

// Consumer code: platform-agnostic
const ui = uiFactory.create("ios");
const loginForm = [
  ui.input("Email"),
  ui.input("Password"),
  ui.button("Sign In"),
];
// All components guaranteed to be iOS. Switch to "android" and everything re-skins.
```

Platform selected once. All components from the same family. No mixing possible.

---

## Live Demo

A mini phone screen with a form. Switch between iOS, Android, and Web and watch the entire UI re-skin at once: buttons, inputs, modals, navigation. The consumer code calls `factory.createButton()` without knowing which platform is active.

<PatternDemo pattern="abstract-factory" />

---

## Real-World Analogy

A furniture store with style collections: Modern, Victorian, Art Deco. When you pick "Modern", you get a modern chair, modern table, modern lamp: all designed to work together. You don't mix Victorian chairs with Art Deco tables.

---

## When to Use It

- Create families of related objects that must be used together
- Support multiple platforms, themes, or configurations
- Ensure visual/behavioral consistency across related components
- Swap entire families at runtime (theme switching, platform detection)

---

## When NOT to Use It

If you only have one "family" or your objects aren't related, a simple factory function is enough. Abstract Factory adds indirection that only pays off when you have multiple interchangeable families.

---

## API

- [createAbstractFactory](/api/eidos/abstract-factory/createAbstractFactory) — Build a factory that produces families of related objects
