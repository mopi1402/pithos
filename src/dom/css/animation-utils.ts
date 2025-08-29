import {
  TransitionConfig,
  StylesInput,
  TransitionableStyles,
} from "../../types/animations/transition-config";
import { isString } from "../../types/guards/type-guards";
import { applyStyles, extractClassNames } from "./style-utils";

const TRANSITION_SAFETY_MARGIN = 50;

/**
 * Core transition runner that handles the common transition logic.
 *
 * This internal function manages the transition lifecycle:
 * 1. Applies the transition CSS property
 * 2. Forces a reflow to ensure reliable transition triggering
 * 3. Executes the provided apply function
 * 4. Waits for the transition to complete with safety margin
 * 5. Optionally restores the original transition
 *
 * @param element - The target DOM element
 * @param apply - Function to execute during the transition
 * @param config - Transition configuration (duration, easing, property)
 * @param restoreOriginalTransition - Whether to restore the original transition after completion
 * @returns Promise that resolves after the transition completes
 * @since 1.0.0
 *
 * @internal
 */
const runTransition = (
  element: HTMLElement,
  apply: () => void,
  config: TransitionConfig = {},
  restoreOriginalTransition = false
): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const {
        duration = 300,
        easing = "ease-in-out",
        property = "all",
      } = config;

      const originalTransition = restoreOriginalTransition
        ? element.style.transition
        : "";

      element.style.transition = `${property} ${duration}ms ${easing}`;

      // Force reflow to ensure transition triggers reliably
      void element.offsetWidth;

      apply();

      setTimeout(() => {
        if (restoreOriginalTransition) {
          element.style.transition = originalTransition;
        }
        resolve();
      }, duration + TRANSITION_SAFETY_MARGIN);
    } catch {
      resolve();
    }
  });
};

/**
 * Applies an exit transition to an element by removing CSS styles or classes.
 *
 * This function intelligently handles transitions by automatically detecting
 * if there are style changes to apply. If no changes are detected,
 * the function terminates immediately without transition.
 *
 * @param element - The target DOM element for the transition
 * @param styles - The CSS styles or classes to remove (string of classes or style object)
 * @param config - Optional transition configuration (duration, easing, property)
 * @returns Promise that resolves once the transition is complete
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Exit transition with CSS classes
 * await transitionFrom(element, 'active visible', { duration: 500 });
 *
 * // Exit transition with inline styles
 * await transitionFrom(element, { opacity: '0', transform: 'scale(0.8)' });
 * ```
 */
export const transitionFrom = (
  element: HTMLElement,
  styles: StylesInput,
  config: TransitionConfig = {}
): Promise<void> => {
  try {
    const { duration = 300, easing = "ease-in-out", property = "all" } = config;

    if (isString(styles)) {
      return transitionFromClasses(element, styles, {
        duration,
        easing,
        property,
      });
    }

    if (!hasStyleChanges(element, styles)) {
      removeStylesInline(element, styles);
      return Promise.resolve();
    }

    return transitionFromStyles(element, styles, {
      duration,
      easing,
      property,
    });
  } catch {
    return Promise.resolve();
  }
};

/**
 * Applies an entrance transition to an element by adding CSS styles or classes.
 *
 * This function immediately applies the styles/classes and configures the CSS transition.
 * The Promise resolves after the transition duration + a 50ms safety margin.
 *
 * @param element - The target DOM element for the transition
 * @param styles - The CSS styles or classes to apply (string of classes or style object)
 * @param config - Optional transition configuration (duration, easing, property)
 * @returns Promise that resolves once the transition is complete
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Entrance transition with CSS classes
 * await transitionTo(element, 'active visible', { duration: 300, easing: 'ease-out' });
 *
 * // Entrance transition with inline styles
 * await transitionTo(element, { opacity: '1', transform: 'scale(1)' });
 * ```
 */
export const transitionTo = (
  element: HTMLElement,
  styles: StylesInput,
  config?: TransitionConfig
): Promise<void> => {
  return runTransition(element, () => applyStyles(element, styles), config);
};

/**
 * Handles exit transition for CSS classes.
 *
 * Immediately removes the classes and applies the CSS transition.
 * Uses a 50ms safety margin to ensure Promise resolution.
 *
 * @param element - The target DOM element
 * @param classes - Space-separated CSS class names
 * @param config - Transition configuration
 * @returns Promise that resolves after the transition
 * @since 1.0.0
 *
 * @internal
 */
const transitionFromClasses = (
  element: HTMLElement,
  classes: string,
  config?: TransitionConfig
): Promise<void> => {
  return runTransition(
    element,
    () => {
      const classArray = extractClassNames(classes);
      if (classArray.length) {
        element.classList.remove(...classArray);
      }
    },
    config
  );
};

/**
 * Handles exit transition for inline styles.
 *
 * Saves the original transition, applies the new transition,
 * removes the specified styles, then restores the original transition.
 *
 * @param element - The target DOM element
 * @param styles - Object containing CSS properties to remove
 * @param config - Transition configuration
 * @returns Promise that resolves after the transition
 * @since 1.0.0
 *
 * @internal
 */
const transitionFromStyles = (
  element: HTMLElement,
  styles: TransitionableStyles,
  config?: TransitionConfig
): Promise<void> => {
  return runTransition(
    element,
    () => removeStylesInline(element, styles),
    config,
    true // restore original transition
  );
};

/**
 * Checks if there are style changes to apply.
 *
 * Compares the element's current styles with the target styles.
 * Handles CSS custom properties (--variable) and standard properties.
 *
 * @param element - The DOM element to check
 * @param styles - The target styles to compare against
 * @returns true if there are changes, false otherwise
 * @since 1.0.0
 *
 * @internal
 */
const hasStyleChanges = (
  element: HTMLElement,
  styles: TransitionableStyles
): boolean => {
  const computed = getComputedStyle(element);

  return Object.entries(styles).some(([prop, value]) => {
    if (value == null) return false;

    const normalizedProp =
      prop.includes("-") && !prop.startsWith("--")
        ? prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
        : prop;

    const currentValue = prop.startsWith("--")
      ? element.style.getPropertyValue(prop) || computed.getPropertyValue(prop)
      : element.style[normalizedProp as keyof CSSStyleDeclaration] ||
        computed[normalizedProp as keyof CSSStyleDeclaration];

    return String(currentValue).trim() !== String(value).trim();
  });
};

/**
 * Removes inline CSS properties from an element.
 *
 * Automatically converts property names from camelCase to kebab-case
 * for DOM API compatibility.
 *
 * @param element - The target DOM element
 * @param styles - Object containing CSS properties to remove
 * @since 1.0.0
 *
 * @internal
 */
const removeStylesInline = (
  element: HTMLElement,
  styles: TransitionableStyles
): void => {
  for (const key of Object.keys(styles)) {
    element.style.removeProperty(
      key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    );
  }
};
