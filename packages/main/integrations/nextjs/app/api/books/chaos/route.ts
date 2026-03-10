import { NextResponse } from 'next/server'
import { ensure } from '@pithos/core/bridges/ensure'
import { chaosSchema } from '../../../lib/schemas/book'
import * as store from '../store'

// ── GET /api/books/chaos ───────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ enabled: store.isChaosEnabled() })
}

// ── POST /api/books/chaos ──────────────────────────────────────────
export async function POST(request: Request) {
  const body: unknown = await request.json()
  const result = ensure(chaosSchema, body)

  if (result.isErr()) {
    return NextResponse.json({ error: { message: result.error } }, { status: 400 })
  }

  store.setChaos(result.value.enabled)
  return NextResponse.json({ enabled: store.isChaosEnabled() })
}
