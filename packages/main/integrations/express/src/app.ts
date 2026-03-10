import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './lib/error-handler.js'
import chaosRouter from './routes/chaos.js'
import collectionRouter from './routes/collection.js'
import seedRouter from './routes/seed.js'
import booksRouter from './routes/books.js'

const app = express()

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
}))

// Mount routes (more specific first)
app.use('/books/chaos', chaosRouter)
app.use('/books/collection', collectionRouter)
app.use('/books/seed', seedRouter)
app.use('/books', booksRouter)

// Error handler must be registered AFTER all routes
app.use(errorMiddleware)

export default app
