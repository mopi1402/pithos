import { Router } from 'express'
import * as store from '../lib/store.js'
import { sampleBooks } from '../lib/fixtures.js'

const router = Router()

router.post('/', (_req, res) => {
  store.clear()
  for (const book of sampleBooks) {
    store.add({ ...book, id: crypto.randomUUID() })
  }
  res.status(201).json(store.getAll())
})

export default router
