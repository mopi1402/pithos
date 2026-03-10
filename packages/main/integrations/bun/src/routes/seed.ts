import * as store from '../lib/store.ts'
import { sampleBooks } from '../lib/fixtures.ts'

export function handlePostSeed(_req: Request): Response {
  store.clear()
  for (const book of sampleBooks) {
    store.add({ ...book, id: crypto.randomUUID() })
  }
  return Response.json(store.getAll(), { status: 201 })
}
