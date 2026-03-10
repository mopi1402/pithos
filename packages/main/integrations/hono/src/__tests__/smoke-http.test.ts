/**
 * HTTP smoke tests — replaces test-api.sh.
 *
 * Starts a real @hono/node-server, runs every check via fetch(),
 * then shuts the server down. No curl, no python, no bash.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { serve } from '@hono/node-server'
import type { ServerType } from '@hono/node-server'
import app from '../app.js'

const PORT = 3002 // avoid colliding with dev server on 3001
const BASE = `http://localhost:${PORT}`

let server: ServerType

beforeAll(async () => {
  server = serve({ fetch: app.fetch, port: PORT })
  // wait for the server to be ready
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
  server.close()
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
  // ── Reset ──────────────────────────────────────────────────────
  it('DELETE /books?id=all → 204', async () => {
    const res = await del('/books?id=all')
    expect(res.status).toBe(204)
  })

  // ── GET empty ─────────────────────────────────────────────────
  it('GET /books returns [] when empty', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  // ── Seed ──────────────────────────────────────────────────────
  it('POST /books/seed → 201 with 7 books', async () => {
    const res = await post('/books/seed')
    expect(res.status).toBe(201)
    const books = await res.json()
    expect(books).toHaveLength(7)
  })

  // ── GET all after seed ────────────────────────────────────────
  it('GET /books returns 7 books after seed', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
    const books = await res.json()
    expect(books).toHaveLength(7)
  })

  // ── POST valid book ───────────────────────────────────────────
  let newBookId: string

  it('POST /books → 201 with titleCased fields', async () => {
    const res = await post('/books', {
      title: 'the pragmatic programmer',
      author: 'david thomas',
      isbn: '0135957052',
      genre: 'Non-Fiction',
    })
    expect(res.status).toBe(201)
    const book = await res.json()
    expect(book.title).toBe('The Pragmatic Programmer')
    expect(book.id).toBeDefined()
    newBookId = book.id
  })

  // ── Duplicate ISBN ────────────────────────────────────────────
  it('POST /books with duplicate ISBN → 409', async () => {
    const res = await post('/books', {
      title: 'another book',
      author: 'someone',
      isbn: '0135957052',
      genre: 'Fiction',
    })
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error.code).toBe(0x9001)
  })

  // ── Invalid payload ───────────────────────────────────────────
  it('POST /books with invalid payload → 400', async () => {
    const res = await post('/books', { title: 'missing fields' })
    expect(res.status).toBe(400)
  })

  // ── DELETE specific book ──────────────────────────────────────
  it('DELETE /books?id=<uuid> → 204', async () => {
    const res = await del(`/books?id=${newBookId}`)
    expect(res.status).toBe(204)
  })

  // ── DELETE non-existent ───────────────────────────────────────
  it('DELETE /books with unknown id → 404', async () => {
    const res = await del('/books?id=00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.code).toBe(0x9003)
  })

  // ── DELETE without id ─────────────────────────────────────────
  it('DELETE /books without id → 400', async () => {
    const res = await del('/books')
    expect(res.status).toBe(400)
  })

  // ── Collection ────────────────────────────────────────────────
  it('GET /books/collection → 200 with multiple genre groups', async () => {
    const res = await fetch(`${BASE}/books/collection`)
    expect(res.status).toBe(200)
    const groups = await res.json()
    expect(groups.length).toBeGreaterThan(1)
  })

  // ── Chaos mode ────────────────────────────────────────────────
  it('POST /books/chaos { enabled: true } → 200', async () => {
    const res = await post('/books/chaos', { enabled: true })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ enabled: true })
  })

  it('GET /books/chaos → { enabled: true }', async () => {
    const res = await fetch(`${BASE}/books/chaos`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ enabled: true })
  })

  it('POST /books with chaos enabled → 503', async () => {
    const res = await post('/books', {
      title: 'fail',
      author: 'fail',
      isbn: '1234567890',
      genre: 'Fiction',
    })
    expect(res.status).toBe(503)
  })

  it('GET /books still works with chaos enabled → 200', async () => {
    const res = await fetch(`${BASE}/books`)
    expect(res.status).toBe(200)
  })

  // ── Disable chaos + empty collection ──────────────────────────
  it('empty collection returns []', async () => {
    await post('/books/chaos', { enabled: false })
    await del('/books?id=all')
    const res = await fetch(`${BASE}/books/collection`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })
})
