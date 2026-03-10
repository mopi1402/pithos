import { ensure } from '@pithos/core/bridges/ensure'
import { chaosSchema } from '../lib/schemas.ts'
import * as store from '../lib/store.ts'

export function handleGetChaos(_req: Request): Response {
  return Response.json({ enabled: store.isChaosEnabled() })
}

export async function handlePostChaos(req: Request): Promise<Response> {
  const body: unknown = await req.json()
  const result = ensure(chaosSchema, body)

  if (result.isErr()) {
    return Response.json({ error: { message: result.error } }, { status: 400 })
  }

  store.setChaos(result.value.enabled)
  return Response.json({ enabled: store.isChaosEnabled() })
}
