'use server'

import { revalidatePath } from 'next/cache'
import { baseUrl } from '../../lib/api/base-url'
import type { ActionResult } from '../../lib/types'

export async function seedCollection(): Promise<ActionResult> {
  try {
    const res = await fetch(baseUrl('/seed'), { method: 'POST' })

    if (!res.ok) {
      return { ok: false, error: `Seed failed (${res.status}): ${res.statusText}` }
    }

    revalidatePath('/collection')
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred.'
    return { ok: false, error: message }
  }
}
