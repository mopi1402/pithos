import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensurePromise } from '@pithos/core/bridges/ensurePromise'
import { storedBookSchema, storedBooksSchema } from '../app/lib/schemas'
import { storedBookArb } from './arbitraries'

describe('API round-trip validation via ensurePromise', () => {
  itProp.prop([storedBookArb], { numRuns: 100 })(
    'valid StoredBook passes ensurePromise with storedBookSchema',
    async (book) => {
      const result = await ensurePromise(storedBookSchema, Promise.resolve(book))
      expect(result.isOk()).toBe(true)
    }
  )

  itProp.prop([fc.array(storedBookArb, { minLength: 0, maxLength: 5 })], { numRuns: 100 })(
    'valid StoredBook[] passes ensurePromise with storedBooksSchema',
    async (books) => {
      const result = await ensurePromise(storedBooksSchema, Promise.resolve(books))
      expect(result.isOk()).toBe(true)
    }
  )

  itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.string(), fc.constant(null))], { numRuns: 100 })(
    'invalid data fails ensurePromise with storedBookSchema',
    async (data) => {
      const result = await ensurePromise(storedBookSchema, Promise.resolve(data))
      expect(result.isErr()).toBe(true)
    }
  )

  itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.string(), fc.constant(null))], { numRuns: 100 })(
    'invalid data fails ensurePromise with storedBooksSchema',
    async (data) => {
      const result = await ensurePromise(storedBooksSchema, Promise.resolve(data))
      expect(result.isErr()).toBe(true)
    }
  )
})
