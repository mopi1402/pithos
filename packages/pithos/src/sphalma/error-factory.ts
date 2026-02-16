/**
 * A structured error with a numeric code and type for easy identification.
 * Designed for tree-shaking: only imported if used.
 * @since 2.0.0
 * @example
 * ```typescript
 * throw new CodedError(101, "Animation", { id: "fade" });
 * // Error: [Animation:101]
 * ```
 */
export class CodedError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly key: string;
  public readonly details?: unknown;

  constructor(code: number, type: string, details?: unknown) {
    const key = `${type}:0x${code.toString(16)}`;
    super(`[${key}]`);
    this.code = code;
    this.type = type;
    this.key = key;
    this.details = details;
    this.name = "CodedError";

    // Maintain prototype chain for instanceof checks
    Object.setPrototypeOf(this, CodedError.prototype);
  }
}

/**
 * Creates a factory function for generating CodedError instances of a specific type.
 * The factory is tree-shakable: if not imported, it won't be bundled.
 * @template Code - The numeric error codes allowed for this factory.
 * @param errorType - The error type/category (e.g., "Animation", "Semaphore").
 * @returns A factory function that creates CodedError instances.
 * @since 2.0.0
 * @example
 * ```typescript
 * const createAnimationError = createErrorFactory<100 | 101 | 102>("Animation");
 * throw createAnimationError(101, { id: "missing" });
 * ```
 */
export function createErrorFactory<Code extends number>(errorType: string) {
  return (code: Code, details?: unknown): CodedError => {
    return new CodedError(code, errorType, details);
  };
}

