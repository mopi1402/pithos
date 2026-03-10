import { useState, useEffect, useCallback } from 'react'
import { getChaos, setChaos } from '../lib/api'

export function useChaos() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChaos().match(
      (val) => { setEnabled(val); setLoading(false) },
      () => { setLoading(false) },
    )
  }, [])

  const toggle = useCallback(() => {
    const next = !enabled
    setEnabled(next)
    setChaos(next).map(setEnabled)
  }, [enabled])

  return { enabled, loading, toggle }
}
