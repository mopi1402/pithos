export const DUPLICATE_ISBN = 0x9001 as const
export const BOOK_NOT_FOUND = 0x9003 as const
export const STORAGE_FAILURE = 0x9004 as const

export const USER_MESSAGES: Record<number, string> = {
  [DUPLICATE_ISBN]: 'A book with this ISBN already exists in your collection.',
  [BOOK_NOT_FOUND]: 'This book could not be found. It may have been removed already.',
  [STORAGE_FAILURE]: 'The server is temporarily unavailable. Please try again.',
}

/**
 * Extracts a user-friendly error message from an already-parsed response body.
 * Synchronous — no try/catch needed since HttpClient parses JSON automatically.
 */
export function extractErrorFromBody(body: unknown): string {
  if (
    typeof body === 'object' && body !== null &&
    'error' in body &&
    typeof (body as Record<string, unknown>)['error'] === 'object'
  ) {
    const inner = (body as Record<string, unknown>)['error'] as Record<string, unknown>
    const { code, message } = inner
    if (typeof code === 'number' && code in USER_MESSAGES) {
      return USER_MESSAGES[code]
    }
    if (typeof message === 'string') return message
  }
  return 'Something went wrong. Please try again.'
}
