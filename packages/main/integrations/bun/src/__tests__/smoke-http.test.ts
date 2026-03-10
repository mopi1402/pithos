/**
 * HTTP smoke tests — starts a real Bun.serve() on port 3002,
 * runs every check via fetch(), then shuts the server down.
 *
 * Adapted from the Hono integration smoke tests.
 */
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { routes, fallbackFetch } from '../app.ts'

const PORT = 3002
const BASE = `http://localhost:${PORT}`

/** Type-safe json helper. */
function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

let server: ReturnType<typeof Bun.serve>

beforeAll(async () => {
  server = Bun.serve({ port: PORT, routes, fetch: fallbackFetch })
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${BASE}/books`)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
  throw new Error('Server did not start in time')
})

afterAll(() => {
  server.stop(true)
})

function post(path: string, body?: unknown) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
}

function del(path: string) {
  return fetch(`${BASE}${path}`, { method: 'DELETE' })
}

describe('HTTP smoke tests', () => {
  test('DELETE /books?id=all → 204', async () => {
    const res = await del('/books?id=all')
    expect(res.status).toBe(204)
  })

  test('GET /books returns [] when empty', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  test('POST /books/seed → 201 with 7 books', async () => {
    const res = await post('/books/seed')
    expect(res.status).toBe(201)
    const books = await json<unknown[]>(res)
    expect(books).toHaveLength(7)
  })

  test('GET /books returns 7 books after seed', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
    const books = await json<unknown[]>(res)
    expect(books).toHaveLength(7)
  })

  let newBookId: string

  test('POST /books → 201 with titleCased fields', async () => {
    const res = await post('/books', {
      title: 'the pragmatic programmer',
      author: 'david thomas',
      isbn: '0135957052',
      genre: 'Non-Fiction',
    })
    expect(res.status).toBe(201)
    const book = await json<{ title: string; id: string }>(res)
    expect(book.title).toBe('The Pragmatic Programmer')
    expect(book.id).toBeDefined()
    newBookId = book.id
  })

  test('POST /books with duplicate ISBN → 409', async () => {
    const res = await post('/books', {
      title: 'another book',
      author: 'someone',
      isbn: '0135957052',
      genre: 'Fiction',
    })
    expect(res.status).toBe(409)
    const body = await json<{ error: { code: number } }>(res)
    expect(body.error.code).toBe(0x9001)
  })

  test('POST /books with invalid payload → 400', async () => {
    const res = await post('/books', { title: 'missing fields' })
    expect(res.status).toBe(400)
  })

  test('DELETE /books?id=<uuid> → 204', async () => {
    const res = await del(`/books?id=${newBookId}`)
    expect(res.status).toBe(204)
  })

  test('DELETE /books with unknown id → 404', async () => {
    const res = await del('/books?id=00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    const body = await json<{ error: { code: number } }>(res)
    expect(body.error.code).toBe(0x9003)
  })

  test('DELETE /books without id → 400', async () => {
    const res = await del('/books')
    expect(res.status).toBe(400)
  })

  test('GET /books/collection → 200 with multiple genre groups', async () => {
    const res = await fetch(`${BASE}/books/collection`)
    expect(res.status).toBe(200)
    const groups = await json<unknown[]>(res)
    expect(groups.length).toBeGreaterThan(1)
  })

  test('POST /books/chaos { enabled: true } → 200', async () => {
    const res = await post('/books/chaos', { enabled: true })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ enabled: true })
  })

  test('GET /books/chaos → { enabled: true }', async () => {
    const res = await fetch(`${BASE}/books/chaos`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ enabled: true })
  })

  test('POST /books with chaos enabled → 503', async () => {
    const res = await post('/books', {
      title: 'fail',
      author: 'fail',
      isbn: '1234567890',
      genre: 'Fiction',
    })
    expect(res.status).toBe(503)
  })

  test('DELETE /books with chaos enabled → 503', async () => {
    const res = await del('/books?id=00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(503)
  })

  test('GET /books still works with chaos enabled → 200', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
  })

  test('empty collection returns []', async () => {
    await post('/books/chaos', { enabled: false })
    await del('/books?id=all')
    const res = await fetch(`${BASE}/books/collection`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  test('GET /unknown → 404', async () => {
    const res = await fetch(`${BASE}/unknown`)
    expect(res.status).toBe(404)
  })

  test('PUT /books → 405', async () => {
    const res = await fetch(`${BASE}/books`, { method: 'PUT' })
    expect(res.status).toBe(405)
  })

  test('OPTIONS /books → 204 with CORS headers', async () => {
    const res = await fetch(`${BASE}/books`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:5173' },
    })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })

  test('POST /books/chaos with invalid payload → 400', async () => {
    const res = await post('/books/chaos', { enabled: 'not-a-boolean' })
    expect(res.status).toBe(400)
  })
})
