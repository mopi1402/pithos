/**
 * Represents viewport meta tag values for mobile web applications.
 * @since 1.0.0
 */
export interface ViewportValues {
  /** Initial zoom scale. */
  initialScale: number | null;
  /** Minimum allowed zoom scale. */
  minimumScale: number | null;
  /** Maximum allowed zoom scale. */
  maximumScale: number | null;
  /** Whether user can zoom the page. */
  userScalable: boolean | null;
}
