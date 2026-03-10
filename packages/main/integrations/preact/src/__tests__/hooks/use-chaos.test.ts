import { describe, expect, vi, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { renderHook, act } from '@testing-library/preact'
import { okAsync } from '@pithos/core/zygos/result/result-async'

vi.mock('../../lib/api', () => ({
  getChaos: vi.fn(),
  setChaos: vi.fn(),
}))

import { useChaos } from '../../hooks/use-chaos'
import { getChaos, setChaos } from '../../lib/api'

const flushMicrotasks = () => act(async () => {
  await new Promise((r) => setTimeout(r, 0))
})

describe('Chaos toggle inverts state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  itProp.prop(
    [fc.boolean()],
    { numRuns: 100 },
  )('toggle inverts the current chaos state', async (initialState) => {
    vi.mocked(getChaos).mockReturnValue(okAsync(initialState))
    vi.mocked(setChaos).mockReturnValue(okAsync(!initialState))

    const { result } = renderHook(() => useChaos())
    await flushMicrotasks()

    expect(result.current.enabled).toBe(initialState)

    await act(() => { result.current.toggle() })
    await flushMicrotasks()

    expect(vi.mocked(setChaos)).toHaveBeenCalledWith(!initialState)
    expect(result.current.enabled).toBe(!initialState)
  })
})
