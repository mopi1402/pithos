'use client'

import { useTransition, useCallback } from 'react'
import type { ActionResult } from '../lib/types'

/**
 * Wraps a server action in a transition, exposing a stable
 * `execute` callback and a `pending` flag.
 *
 * When the action returns `{ ok: false }`, the optional
 * `onError` callback is invoked with the error message.
 */
export function useServerAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<ActionResult>,
  onError?: (msg: string) => void,
) {
  const [pending, startTransition] = useTransition()

  const execute = useCallback(
    (...args: Args) => {
      startTransition(async () => {
        const result = await action(...args)
        if (!result.ok) onError?.(result.error)
      })
    },
    [action, startTransition, onError],
  )

  return { execute, pending }
}
