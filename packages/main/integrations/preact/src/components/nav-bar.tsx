import { ChaosToggle } from './chaos-toggle'

export function NavBar() {
  return (
    <nav class="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div class="mx-auto flex max-w-3xl items-center justify-between">
        <a href="/" class="text-lg font-semibold tracking-tight">Pithos × Preact</a>
        <ChaosToggle />
      </div>
    </nav>
  )
}
