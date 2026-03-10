import { Link } from 'react-router'
import { AddForm } from '../components/add-form'

export function AddPage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Add a book</h1>
        <Link to="/collection" className="text-sm text-zinc-500 hover:text-zinc-700">
          ← Back to collection
        </Link>
      </div>
      <AddForm />
    </>
  )
}
