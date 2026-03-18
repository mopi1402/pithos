---
title: "Template Method Pattern in TypeScript"
sidebar_label: "Template Method"
description: "Learn how to implement the Template Method design pattern in TypeScript with functional programming. Define algorithm skeletons with customizable steps."
keywords:
  - template method typescript
  - algorithm skeleton
  - hook methods
  - customizable steps
  - inversion of control
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Template Method Pattern

Define the skeleton of an algorithm, deferring some steps to subclasses (or in FP: to injected functions).

---

## The Problem

You're building a resume generator. Every resume follows the same structure: Header → Summary → Experience → Skills → Education. But a developer's resume highlights TypeScript and system design, a designer's highlights Figma and design systems, and a manager's highlights team building and OKRs.

The naive approach:

```typescript
function buildDeveloperResume() {
  return [
    devHeader(),
    devSummary(),
    devExperience(),
    devSkills(),
    devEducation(),
  ];
}

function buildDesignerResume() {
  return [
    designerHeader(),
    designerSummary(),
    designerExperience(),
    designerSkills(),
    designerEducation(),
  ];
}
// Same skeleton repeated for every profile
```

The structure is identical. Only the content of each step changes. Adding a new section means updating every function.

---

## The Solution

Define the skeleton once with default steps. Each profile only overrides what's different:

```typescript
import { templateWithDefaults } from "@pithos/core/eidos/template/template";

const buildResume = templateWithDefaults(
  (steps: ResumeSteps) =>
    (): ResumeSection[] => [
      steps.header(),
      steps.summary(),
      steps.experience(),
      steps.skills(),
      steps.education(),
    ],
  DEFAULT_STEPS, // base implementation for all 5 steps
);

// Developer: override 3 steps, keep default header + education
const devResume = buildResume({
  summary: () => ({ title: "Summary", content: ["Full-stack developer with 7+ years..."] }),
  experience: () => ({ title: "Experience", content: ["Senior Engineer — Stripe..."] }),
  skills: () => ({ title: "Skills", content: ["TypeScript · React · Node.js..."] }),
});

// Designer: override all 5 steps (different portfolio link, different education)
const designerResume = buildResume({
  header: () => ({ title: "Alex Johnson", content: ["...", "portfolio.alexj.design"] }),
  summary: () => ({ title: "Summary", content: ["Product designer with 6+ years..."] }),
  experience: () => ({ title: "Experience", content: ["Senior Designer — Figma..."] }),
  skills: () => ({ title: "Skills", content: ["Figma · Design Systems..."] }),
  education: () => ({ title: "Education", content: ["M.F.A. Interaction Design — RISD"] }),
});
```

The skeleton (Header → Summary → Experience → Skills → Education) is defined once. Each profile only specifies what's different. `templateWithDefaults` merges the overrides with the defaults automatically.

---

## Live Demo

Switch between Developer, Designer, and Manager profiles. The template skeleton is always the same 5 steps in the same order. The step pipeline on the left shows which steps are overridden (amber) vs using defaults (gray). When you switch profiles, the steps execute sequentially to show the template in action.

<PatternDemo pattern="template" />

---

## Real-World Analogy

A recipe template. "Make soup: 1) prep ingredients, 2) boil water, 3) add ingredients, 4) simmer, 5) serve." The template is the same for all soups. Each soup recipe just fills in what ingredients to prep and add.

---

## When to Use It

- Multiple algorithms share the same structure
- You want to enforce a sequence of steps
- Some steps vary while others stay constant
- You need sensible defaults with selective overrides

---

## When NOT to Use It

If every step is different for every variant, there's no shared skeleton. You just have different functions. Template Method shines when the structure is fixed and only the content varies.

---

## API

- [templateWithDefaults](/api/eidos/template/templateWithDefaults) — Create algorithm templates with overridable steps
