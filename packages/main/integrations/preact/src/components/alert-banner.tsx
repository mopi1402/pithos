import type { ComponentChildren } from 'preact'

type Variant = 'error' | 'success'

const styles: Record<Variant, string> = {
  error: 'rounded bg-red-50 p-3 text-sm text-red-700',
  success: 'rounded bg-green-50 p-3 text-sm text-green-700',
}

export function AlertBanner({ variant = 'error', children }: { variant?: Variant; children: ComponentChildren }) {
  if (!children) return null
  return <div class={styles[variant]} role="alert">{children}</div>
}
