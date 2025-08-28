import { EasingFunction } from "../types/animations/easing";

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

const n1 = 7.5625;
const d1 = 2.75;

// -- Back --------------------------------------------------------------------

export function easeInBack(x: number): number {
  return c3 * x * x * x - c1 * x * x;
}

export function easeOutBack(x: number): number {
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function easeInOutBack(x: number): number {
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

// -- Bounce ------------------------------------------------------------------

function bounceOut(x: number): number {
  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

export function easeInBounce(x: number): number {
  return 1 - bounceOut(1 - x);
}

export function easeOutBounce(x: number): number {
  return bounceOut(x);
}

export function easeInOutBounce(x: number): number {
  return x < 0.5
    ? (1 - bounceOut(1 - 2 * x)) / 2
    : (1 + bounceOut(2 * x - 1)) / 2;
}

// -- Circ --------------------------------------------------------------------

export function easeInCirc(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function easeInOutCirc(x: number): number {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

// -- Cubic -------------------------------------------------------------------

export function easeInCubic(x: number): number {
  return x * x * x;
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// -- Elastic -----------------------------------------------------------------

export function easeInElastic(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}

export function easeOutElastic(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export function easeInOutElastic(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

// -- Expo --------------------------------------------------------------------

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

// -- Linear ------------------------------------------------------------------

export function linear(x: number): number {
  return x;
}

// -- Quad --------------------------------------------------------------------

export function easeInQuad(x: number): number {
  return x * x;
}

export function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// -- Quart -------------------------------------------------------------------

export function easeInQuart(x: number): number {
  return x * x * x * x;
}

export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

// -- Quint --------------------------------------------------------------------

export function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

export function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

export function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

// -- Sine --------------------------------------------------------------------

export function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2);
}

export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * ⚠️ WARNING: Importing this function prevents tree shaking of individual easing functions!
 *
 * When you import this function in your project, you lose the ability to tree shake
 * the specific easing functions you actually use. All easing functions will be included
 * in your final bundle.
 *
 * Instead, import directly the specific easing functions you need:
 * ```typescript
 * // ❌ Bad - no tree shaking, all easing functions included
 * import { getEasingFunction } from './ease';
 * const ease = getEasingFunction('easeInOut');
 *
 * // ✅ Good - tree shaking works, only easeInOut included
 * import { easeInOut } from './ease';
 * ```
 */
export function getEasingFunction(type: string): EasingFunction {
  return easingFunctions[type] || linear;
}

const easingFunctions: Record<string, EasingFunction> = {
  linear,

  easeInQuad,
  easeOutQuad,
  easeInOutQuad,

  easeInCubic,
  easeOutCubic,
  easeInOutCubic,

  easeInQuart,
  easeOutQuart,
  easeInOutQuart,

  easeInQuint,
  easeOutQuint,
  easeInOutQuint,

  easeInSine,
  easeOutSine,
  easeInOutSine,

  easeInExpo,
  easeOutExpo,
  easeInOutExpo,

  easeInCirc,
  easeOutCirc,
  easeInOutCirc,

  easeInBack,
  easeOutBack,
  easeInOutBack,

  easeInElastic,
  easeOutElastic,
  easeInOutElastic,

  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};
