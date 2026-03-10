import type { ReactNode } from 'react'

type Variant = 'error' | 'success'

const styles: Record<Variant, string> = {
  error: 'rounded bg-red-50 p-3 text-sm text-red-700',
  success: 'rounded bg-green-50 p-3 text-sm text-green-700',
}

export function AlertBanner({ variant = 'error', children }: { variant?: Variant; children: ReactNode }) {
  if (!children) return null
  return <div className={styles[variant]} role="alert">{children}</div>
}
