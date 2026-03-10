export const GENRES = [
  'Fiction',
  'Science-Fiction',
  'Fantasy',
  'Mystery',
  'Non-Fiction',
  'Biography',
  'History',
  'Science',
  'Philosophy',
  'Other',
] as const

export const API_URL = import.meta.env['NG_APP_API_URL'] ?? 'http://localhost:3001'
