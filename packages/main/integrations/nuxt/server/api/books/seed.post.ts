import { sampleBooks } from '../../../app/lib/fixtures'
import { clear, add, getAll } from '../../utils/store'

// ── POST /api/books/seed ───────────────────────────────────────────
export default defineEventHandler((event) => {
  clear()
  for (const book of sampleBooks) {
    add({ ...book, id: crypto.randomUUID() })
  }
  setResponseStatus(event, 201)
  return getAll()
})
