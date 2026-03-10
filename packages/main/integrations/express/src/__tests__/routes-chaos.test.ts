import { describe, expect, beforeEach, it } from 'vitest'
import fc from 'fast-check'
import request from 'supertest'
import app from '../app.js'
import * as store from '../lib/store.js'

const invalidChaosPayloadArb = fc.oneof(
  fc.record({ enabled: fc.oneof(fc.integer(), fc.string(), fc.constant(null)) }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({ other: fc.string() }).map((r) => r as Record<string, unknown>),
  fc.constant({} as Record<string, unknown>),
)

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

  // Feature: express-integration-demo, Property 10: Chaos state round-trip
  // **Validates: Requirements 8.1, 8.2**
  it('chaos state round-trip — POST { enabled: b } then GET returns { enabled: b }', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (b) => {
        store.setChaos(false)

        const postRes = await request(app).post('/books/chaos').send({ enabled: b })
        expect(postRes.status).toBe(200)
        expect(postRes.body).toEqual({ enabled: b })

        const getRes = await request(app).get('/books/chaos')
        expect(getRes.status).toBe(200)
        expect(getRes.body).toEqual({ enabled: b })
      }),
      { numRuns: 100 },
    )
  })

  // Feature: express-integration-demo, Property 11: Chaos mode effect on operations
  // **Validates: Requirements 8.4, 8.5**
  it('chaos mode blocks POST/DELETE /books with 503, GET /books still works', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        store.clear()
        store.setChaos(true)

        const postRes = await request(app).post('/books').send(samplePayload)
        expect(postRes.status).toBe(503)
        expect(postRes.body.error.code).toBe(0x9004)

        const deleteRes = await request(app).delete('/books?id=some-id')
        expect(deleteRes.status).toBe(503)
        expect(deleteRes.body.error.code).toBe(0x9004)

        const getRes = await request(app).get('/books')
        expect(getRes.status).toBe(200)
      }),
      { numRuns: 100 },
    )
  })

  // Feature: express-integration-demo, Property 4 (chaos variant): Invalid chaos payload rejection
  // **Validates: Requirements 8.3, 12.2**
  it('invalid chaos payload returns 400', async () => {
    await fc.assert(
      fc.asyncProperty(invalidChaosPayloadArb, async (payload) => {
        const res = await request(app).post('/books/chaos').send(payload)
        expect(res.status).toBe(400)
        expect(res.body.error.message).toBeDefined()
      }),
      { numRuns: 100 },
    )
  })
})
