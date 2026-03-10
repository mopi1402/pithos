import { Router } from 'express'
import { ensure } from '@pithos/core/bridges/ensure'
import { chaosSchema } from '../lib/schemas.js'
import * as store from '../lib/store.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ enabled: store.isChaosEnabled() })
})

router.post('/', (req, res) => {
  const body: unknown = req.body
  const result = ensure(chaosSchema, body)
  if (result.isErr()) {
    res.status(400).json({ error: { message: result.error } })
    return
  }
  store.setChaos(result.value.enabled)
  res.json({ enabled: store.isChaosEnabled() })
})

export default router
