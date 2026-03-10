import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import * as store from '$lib/server/store'

export const DELETE: RequestHandler = async ({ params }) => {
  if (store.isChaosEnabled()) {
    error(503, { message: 'The server is temporarily unavailable. Please try again.' })
  }

  const result = store.removeBook(params.id)
  if (!result.ok) {
    error(404, { message: result.error })
  }

  return new Response(null, { status: 204 })
}
