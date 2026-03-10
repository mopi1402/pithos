import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { titleCase } from '@pithos/core/arkhe/string/title-case'

describe('titleCase normalization', () => {
  itProp.prop(
    [fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)],
    { numRuns: 100 },
  )('titleCase is idempotent', (s) => {
    expect(titleCase(titleCase(s))).toBe(titleCase(s))
  })

  itProp.prop(
    [
      fc.array(fc.stringMatching(/^[a-zA-Z]+$/), { minLength: 1, maxLength: 5 })
        .map(words => words.join(' ')),
    ],
    { numRuns: 100 },
  )('each word starts with an uppercase letter', (s) => {
    const result = titleCase(s)
    const words = result.split(/[\s\-_]+/).filter(w => w.length > 0)
    for (const word of words) {
      const firstLetter = word.match(/\p{L}/u)?.[0]
      if (firstLetter) {
        expect(firstLetter).toBe(firstLetter.toUpperCase())
      }
    }
  })
})
