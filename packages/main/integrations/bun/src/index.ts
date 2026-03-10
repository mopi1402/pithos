import { routes, fallbackFetch } from './app.ts'

Bun.serve({ port: 3001, routes, fetch: fallbackFetch })

console.log('Server running on http://localhost:3001')
