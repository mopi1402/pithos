import * as store from '$lib/server/store'

export function load() {
  return { chaosEnabled: store.isChaosEnabled() }
}
