import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ensure } from '@pithos/core/bridges/ensure'
import { object } from '@pithos/core/kanon/schemas/composites/object'
import { boolean } from '@pithos/core/kanon/schemas/primitives/boolean'
import * as store from '$lib/server/store'

const chaosSchema = object({ enabled: boolean() })

export const GET: RequestHandler = async () => {
  return json({ enabled: store.isChaosEnabled() })
}

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: { message: 'Invalid JSON body.' } }, { status: 400 })
  }

  const result = ensure(chaosSchema, body)
  if (result.isErr()) {
    return json({ error: { message: result.error } }, { status: 400 })
  }

  store.setChaos(result.value.enabled)
  return json({ enabled: store.isChaosEnabled() })
}
