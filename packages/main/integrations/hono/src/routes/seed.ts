import { Hono } from 'hono'
import * as store from '../lib/store.js'
import { sampleBooks } from '../lib/fixtures.js'

const seed = new Hono()

seed.post('/', (c) => {
  store.clear()
  for (const book of sampleBooks) {
    store.add({ ...book, id: crypto.randomUUID() })
  }
  return c.json(store.getAll(), 201)
})

export default seed
