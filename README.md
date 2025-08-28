[![npm version](https://badge.fury.io/js/pithos.svg)](https://www.npmjs.com/package/pithos)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

# 🏺 Pithos Superset

**Open the box to unleash the power**

Advanced JavaScript/TypeScript superset providing performance, gestures, animations, DOM utilities, and practical helpers & utils.

## ✨ Key Features

- **🔄 Framework-Agnostic** - Built with TypeScript, runs as vanilla JavaScript
- **⚡ Lightweight & Performant** - Carefully optimized for bundle size and smooth performance
- **🌐 Universal Compatibility** - Works seamlessly with React, Vue, Angular, Svelte, or vanilla JS
- **🎯 Tree-Shaking Ready** - Import only what you need for optimal bundle optimization
- **🛠️ Production-Ready** - Battle-tested utilities for real-world applications

Tired of rewriting the same utilities across projects? Whether you're building web apps, libraries, or complex interfaces, Pithos provides the building blocks you need...

Something missing? Let's build it together—reach out or open a PR!

## The Pithos Story

Like Pandora's pithos that contained both problems and solutions, this superset tackles common development pain points while providing the tools you need.
By the way, Pandora's "box" was actually a large jar : "Pithos" in Greek 😉

## 🤔 Why this project?

**Born from personal frustration:**

- 🔍 "Where did I put that utility again?"
- 🔄 Rewriting the same logic because it's faster than searching
- 🧩 Best code scattered across projects, never improving
- 📈 Great utilities stuck in old codebases
- 💪 **Missing the compound effect:** Code that becomes more reliable through repeated use

**The solution:** Centralize, evolve, and battle-test in one place.

If you've felt the same frustration, Pithos might be exactly what you need.

## 🚀 Installation

```bash
npm install pithos
```

## 📦 Usage

**Import, use, done!** No more time wasted on rewriting utilities or figuring out how to implement them:

```typescript
import { Nullable } from "pithos/types/common";
import { parseFloatDef } from "pithos/data/number-utils";
import { AnimationController } from "pithos/animations/animation-controller";
```

**That's it!** Start building immediately instead of reinventing the wheel.

## 🌳 Tree Shaking

Pithos is optimized for tree shaking. Use direct imports for optimal bundle size:

```typescript
// ✅ Good - only FrameScheduler included
import { FrameScheduler } from "pithos/performance/frame-scheduler";

// ❌ Less optimal - entire module included
import { FrameScheduler } from "pithos";
```

## 🛠️ Available modules

- **types** : Common TypeScript utility types...
- **data** : Storage, parsing, number utilities...
- **dom** : Viewport parsing, browser support utilities...
- **performance** : Frame scheduling, debouncing...
- **animations** : Animation controllers, easing functions...
- **gestures** : Touch handling, wheel gestures, gesture recognition...
- **math** : Geometry utilities...

## 💡 Some usecases

### 🏷️ **Nullable Types** - Even the basics matter

```typescript
import { Nullable } from "pithos/types/common";

type User = {
  name: string;
  email: Nullable<string>; // null | string instead of string | undefined
  avatar: Nullable<string>; // Clear intent: can be null
};
```

### 🛡️ **parseFloatDef** - Never get NaN again

```typescript
import { parseFloatDef } from "pithos/data/number-utils";

// Instead of getting NaN and breaking your app
const price = parseFloatDef("invalid_price", 0); // Returns 0
const quantity = parseFloatDef("42.99", 1); // Returns 42.99
const discount = parseFloatDef(undefined, 0.1); // Returns 0.1
```

### 🎬 **AnimationController** - Professional animations made simple

```typescript
import { AnimationController } from "pithos/animations/animation-controller";

const controller = new AnimationController();

// Smooth animation with easing and callbacks
await controller.animate(0, 100, {
  duration: 1000,
  easing: easeOutBounce,
  onUpdate: (value) => (element.style.transform = `translateX(${value}px)`),
  onComplete: () => console.log("Animation finished!"),
});
```

## 🔧 Available scripts

```bash
npm run build      # Build the project
npm run dev        # Build in watch mode
npm run lint       # Code linting
npm run type-check # TypeScript type checking
npm run clean      # Clean build directory
```

## ⚠️ Work in Progress

**This project is currently under active development.**

While Pithos already provides useful utilities, it's intentionally kept **lean and focused**. Rather than creating a bloated toolkit with mediocre features, I prefer to add utilities **one by one** and **optimize them to the maximum**.

**Quality over quantity** - each utility is carefully crafted, tested, and optimized before being added. This ensures that what you get is **actually useful** and **production-ready**, not just another "kitchen sink" library.

**Current status**: Core utilities are stable, new features are added incrementally based on real needs and community feedback.

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements, every contribution helps make Pithos better.

### How to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development setup:

```bash
git clone https://github.com/mopi1402/pithos.git
cd pithos
npm install
npm run dev
```

### Code style:

- Follow the existing TypeScript/ESLint configuration
- Write clear, documented code
- Add tests for new features
- Update documentation as needed

**Questions?** Open an issue or start a discussion!

## 📝 License

MIT
