import { Link } from 'react-router'
import { ChaosToggle } from './chaos-toggle'

export function NavBar() {
  return (
    <nav className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">Pithos × React</Link>
        <ChaosToggle />
      </div>
    </nav>
  )
}
