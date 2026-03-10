import { NextResponse } from 'next/server'
import * as store from '../store'
import { sampleBooks } from '../../../lib/fixtures'

// ── POST /api/books/seed ───────────────────────────────────────────
export async function POST() {
  store.clear()
  for (const book of sampleBooks) {
    store.add({ ...book, id: crypto.randomUUID() })
  }
  return NextResponse.json(store.getAll(), { status: 201 })
}
