'use server'

import { revalidatePath } from 'next/cache'
import { deleteAllBooks } from '../../lib/api/books'
import type { ActionResult } from '../../lib/types'

export async function clearCollection(): Promise<ActionResult> {
  try {
    await deleteAllBooks()
    revalidatePath('/collection')
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred.'
    return { ok: false, error: message }
  }
}
