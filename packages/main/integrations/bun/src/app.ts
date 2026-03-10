import { handleGetBooks, handlePostBook, handleDeleteBook } from './routes/books.ts'
import { handleGetChaos, handlePostChaos } from './routes/chaos.ts'
import { handleGetCollection } from './routes/collection.ts'
import { handlePostSeed } from './routes/seed.ts'
import { handleError } from './lib/error-handler.ts'

const CORS_METHODS = 'GET, POST, DELETE, OPTIONS'
const CORS_HEADERS = 'Content-Type'

function isAllowedOrigin(origin: string): boolean {
  return origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')
}

function addCorsHeaders(response: Response, origin: string): Response {
  const allowed = isAllowedOrigin(origin) ? origin : ''
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', allowed)
  headers.set('Access-Control-Allow-Methods', CORS_METHODS)
  headers.set('Access-Control-Allow-Headers', CORS_HEADERS)
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function withCorsAndErrors(handler: (req: Request) => Response | Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get('Origin') ?? ''
    try {
      const response = await handler(req)
      return addCorsHeaders(response, origin)
    } catch (err) {
      return addCorsHeaders(handleError(err), origin)
    }
  }
}

export const routes = {
  '/books': {
    GET: withCorsAndErrors(handleGetBooks),
    POST: withCorsAndErrors(handlePostBook),
    DELETE: withCorsAndErrors(handleDeleteBook),
  },
  '/books/collection': {
    GET: withCorsAndErrors(handleGetCollection),
  },
  '/books/chaos': {
    GET: withCorsAndErrors(handleGetChaos),
    POST: withCorsAndErrors(handlePostChaos),
  },
  '/books/seed': {
    POST: withCorsAndErrors(handlePostSeed),
  },
}

/** Fallback fetch — handles OPTIONS preflight, 405, and 404. */
export function fallbackFetch(req: Request): Response {
  const origin = req.headers.get('Origin') ?? ''
  const { pathname } = new URL(req.url)

  if (req.method === 'OPTIONS') {
    return addCorsHeaders(new Response(null, { status: 204 }), origin)
  }

  // Known path but unmatched method → 405
  if (pathname in routes) {
    return addCorsHeaders(
      Response.json({ error: { message: 'Method not allowed' } }, { status: 405 }),
      origin,
    )
  }

  return addCorsHeaders(
    Response.json({ error: { message: 'Not found' } }, { status: 404 }),
    origin,
  )
}
