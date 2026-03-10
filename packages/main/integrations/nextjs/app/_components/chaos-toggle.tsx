'use client'

import { useState, useEffect } from 'react'

export default function ChaosToggle() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/books/chaos')
      .then((r) => {
        if (!r.ok) throw new Error(`Chaos GET failed (${r.status})`)
        return r.json() as Promise<{ enabled: boolean }>
      })
      .then((data) => setEnabled(data.enabled))
      .catch((err) => console.debug('[ChaosToggle]', err))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async () => {
    const next = !enabled
    setEnabled(next)
    await fetch('/api/books/chaos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })
  }

  if (loading) return null

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700"
      aria-pressed={enabled}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${enabled ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`} />
      {enabled ? 'Chaos mode ON' : 'Chaos mode'}
    </button>
  )
}
