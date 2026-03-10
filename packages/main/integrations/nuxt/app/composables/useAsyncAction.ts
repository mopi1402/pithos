import type { ActionResult } from '../lib/types'

/**
 * Wraps an async action, exposing a stable `execute` callback
 * and a reactive `pending` flag.
 *
 * When the action returns `{ ok: false }`, the optional
 * `onError` callback is invoked with the error message.
 *
 * Vue equivalent of the `useServerAction` hook from the Next.js demo
 * (replaces React's `useTransition` with a simple `ref`).
 */
export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<ActionResult>,
  onError?: (msg: string) => void,
) {
  const pending = ref(false)

  async function execute(...args: Args) {
    pending.value = true
    try {
      const result = await action(...args)
      if (!result.ok) onError?.(result.error)
    } finally {
      pending.value = false
    }
  }

  return { execute, pending }
}
