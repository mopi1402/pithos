import { describe, expect, beforeEach, test } from 'bun:test'
import fc from 'fast-check'
import { handleGetChaos, handlePostChaos } from '../routes/chaos.ts'
import { handleGetBooks, handlePostBook, handleDeleteBook } from '../routes/books.ts'
import { handleError } from '../lib/error-handler.ts'
import * as store from '../lib/store.ts'

/** Type-safe json helper — avoids `as` casts scattered across tests. */
function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

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

async function postChaos(body: unknown): Promise<Response> {
  const req = new Request('http://localhost/books/chaos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handlePostChaos(req)
}

async function postBook(body: unknown): Promise<Response> {
  const req = new Request('http://localhost/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  try {
    return await handlePostBook(req)
  } catch (err) {
    return handleError(err)
  }
}

function deleteBook(id: string): Response {
  const req = new Request(`http://localhost/books?id=${id}`, { method: 'DELETE' })
  try {
    return handleDeleteBook(req)
  } catch (err) {
    return handleError(err)
  }
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

  // Feature: bun-integration-demo, Property 12: Chaos state round-trip
  test('chaos state round-trip — POST { enabled: b } then GET returns { enabled: b }', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (b) => {
        store.setChaos(false)

        const postRes = await postChaos({ enabled: b })
        expect(postRes.status).toBe(200)
        expect(await postRes.json()).toEqual({ enabled: b })

        const getRes = handleGetChaos(new Request('http://localhost/books/chaos'))
        expect(getRes.status).toBe(200)
        expect(await getRes.json()).toEqual({ enabled: b })
      }),
      { numRuns: 100 },
    )
  })

  // Feature: bun-integration-demo, Property 13: Chaos mode blocks writes but not reads
  test('chaos mode blocks POST/DELETE /books with 503, GET /books still works', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        store.clear()
        store.setChaos(true)

        const postRes = await postBook(samplePayload)
        expect(postRes.status).toBe(503)
        const postBody = await json<{ error: { code: number } }>(postRes)
        expect(postBody.error.code).toBe(0x9004)

        const deleteRes = deleteBook('some-id')
        expect(deleteRes.status).toBe(503)
        const deleteBody = await json<{ error: { code: number } }>(deleteRes)
        expect(deleteBody.error.code).toBe(0x9004)

        const getRes = handleGetBooks(new Request('http://localhost/books'))
        expect(getRes.status).toBe(200)
      }),
      { numRuns: 100 },
    )
  })

  // Feature: bun-integration-demo, Property 6: Invalid chaos payload rejection
  test('invalid chaos payload returns 400', async () => {
    await fc.assert(
      fc.asyncProperty(invalidChaosPayloadArb, async (payload) => {
        const res = await postChaos(payload)
        expect(res.status).toBe(400)
        const body = await json<{ error: { message: string } }>(res)
        expect(body.error.message).toBeDefined()
      }),
      { numRuns: 100 },
    )
  })
})
