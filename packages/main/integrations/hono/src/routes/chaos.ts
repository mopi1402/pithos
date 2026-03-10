import { Hono } from 'hono'
import { ensure } from '@pithos/core/bridges/ensure'
import { chaosSchema } from '../lib/schemas.js'
import * as store from '../lib/store.js'

const chaos = new Hono()

chaos.get('/', (c) => {
  return c.json({ enabled: store.isChaosEnabled() })
})

chaos.post('/', async (c) => {
  const body: unknown = await c.req.json()
  const result = ensure(chaosSchema, body)

  if (result.isErr()) {
    return c.json({ error: { message: result.error } }, 400)
  }

  store.setChaos(result.value.enabled)
  return c.json({ enabled: store.isChaosEnabled() })
})

export default chaos
