import { ensurePromise } from '@pithos/core/bridges/ensurePromise'
import { string } from '@pithos/core/kanon/schemas/primitives/string'
import { number } from '@pithos/core/kanon/schemas/primitives/number'
import { object } from '@pithos/core/kanon/schemas/composites/object'
import { optional } from '@pithos/core/kanon/schemas/wrappers/optional'

const DUPLICATE_ISBN = 0x9001 as const
const BOOK_NOT_FOUND = 0x9003 as const
const STORAGE_FAILURE = 0x9004 as const

export { DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE }

export const USER_MESSAGES: Record<number, string> = {
  [DUPLICATE_ISBN]: 'A book with this ISBN already exists in your collection.',
  [BOOK_NOT_FOUND]: 'This book could not be found. It may have been removed already.',
  [STORAGE_FAILURE]: 'The server is temporarily unavailable. Please try again.',
}

const errorBodySchema = object({
  error: optional(object({
    code: optional(number()),
    key: optional(string()),
    message: optional(string()),
  })),
})

export async function extractError(res: Response): Promise<string> {
  try {
    const json = await res.json()
    const result = await ensurePromise(errorBodySchema, Promise.resolve(json))

    if (result.isErr()) {
      return 'Something went wrong. Please try again.'
    }

    const body = result.value
    const code = body.error?.code

    if (code != null && code in USER_MESSAGES) {
      return USER_MESSAGES[code]
    }

    return body.error?.message ?? res.statusText
  } catch {
    return 'Something went wrong. Please try again.'
  }
}
