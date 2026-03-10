import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { errorHandler } from './lib/error-handler.js'
import books from './routes/books.js'
import chaos from './routes/chaos.js'
import seed from './routes/seed.js'
import collection from './routes/collection.js'

const app = new Hono()

app.use('/*', cors({
  origin: (origin) =>
    origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')
      ? origin
      : null,
}))

app.onError(errorHandler)

// Mount more specific routes first
app.route('/books/chaos', chaos)
app.route('/books/seed', seed)
app.route('/books/collection', collection)
app.route('/books', books)

export default app
