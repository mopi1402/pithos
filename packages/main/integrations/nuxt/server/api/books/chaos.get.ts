import { isChaosEnabled } from '../../utils/store'

// ── GET /api/books/chaos ───────────────────────────────────────────
export default defineEventHandler(() => ({ enabled: isChaosEnabled() }))
