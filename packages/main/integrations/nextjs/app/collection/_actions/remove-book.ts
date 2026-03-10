'use server'

import { revalidatePath } from 'next/cache'
import { deleteBook } from '../../lib/api/books'
import type { ActionResult } from '../../lib/types'

export async function removeBook(id: string): Promise<ActionResult> {
  try {
    await deleteBook(id)
    revalidatePath('/collection')
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred.'
    return { ok: false, error: message }
  }
}
