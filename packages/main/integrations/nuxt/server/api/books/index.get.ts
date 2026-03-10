import { getAll } from '../../utils/store'

// ── GET /api/books ─────────────────────────────────────────────────
export default defineEventHandler(() => getAll())
