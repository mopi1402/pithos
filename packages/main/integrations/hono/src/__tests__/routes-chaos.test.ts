import { describe, expect, beforeEach, it } from 'vitest'
import fc from 'fast-check'
import app from '../app.js'
import * as store from '../lib/store.js'

const invalidChaosPayloadArb = fc.oneof(
  fc.record({ enabled: fc.oneof(fc.integer(), fc.string(), fc.constant(null)) }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({ other: fc.string() }).map((r) => r as Record<string, unknown>),
  fc.constant({} as Record<string, unknown>),
  fc.oneof(fc.string(), fc.integer(), fc.constant(null), fc.constant([])).map(
    (v) => v as unknown as Record<string, unknown>,
  ),
)

function getChaos() {
  return app.request('/books/chaos')
}

function postChaos(body: unknown) {
  return app.request('/books/chaos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function postBook(body: unknown) {
  return app.request('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function deleteBook(id?: string) {
  const url = id ? `/books?id=${id}` : '/books'
  return app.request(url, { method: 'DELETE' })
}

const samplePayload = {
  title: 'the great gatsby',
  author: 'f. scott fitzgerald',
  isbn: '0743273567',
  genre: 'Fiction',
}

describe('chaos routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  it('chaos state round-trip — POST { enabled: b } then GET returns { enabled: b }', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (b) => {
        store.setChaos(false)

        const postRes = await postChaos({ enabled: b })
        expect(postRes.status).toBe(200)
        expect(await postRes.json()).toEqual({ enabled: b })

        const getRes = await getChaos()
        expect(getRes.status).toBe(200)
        expect(await getRes.json()).toEqual({ enabled: b })
      }),
      { numRuns: 100 },
    )
  })

  it('chaos mode blocks POST/DELETE /books with 503, GET /books still works', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        store.clear()
        store.setChaos(true)

        const postRes = await postBook(samplePayload)
        expect(postRes.status).toBe(503)
        expect((await postRes.json()).error.code).toBe(0x9004)

        const deleteRes = await deleteBook('some-id')
        expect(deleteRes.status).toBe(503)
        expect((await deleteRes.json()).error.code).toBe(0x9004)

        const getRes = await app.request('/books')
        expect(getRes.status).toBe(200)
      }),
      { numRuns: 100 },
    )
  })

  it('invalid chaos payload returns 400', async () => {
    await fc.assert(
      fc.asyncProperty(invalidChaosPayloadArb, async (payload) => {
        const res = await postChaos(payload)
        expect(res.status).toBe(400)
        expect((await res.json()).error.message).toBeDefined()
      }),
      { numRuns: 100 },
    )
  })
})
