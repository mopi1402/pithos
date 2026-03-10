import { ensure } from '@pithos/core/bridges/ensure'
import { chaosSchema } from '../../../app/lib/schemas/book'
import { setChaos, isChaosEnabled } from '../../utils/store'

// ── POST /api/books/chaos ──────────────────────────────────────────
export default defineEventHandler(async (event) => {
  const body: unknown = await readBody(event)
  const result = ensure(chaosSchema, body)

  if (result.isErr()) {
    setResponseStatus(event, 400)
    return { error: { message: result.error } }
  }

  setChaos(result.value.enabled)
  return { enabled: isChaosEnabled() }
})
