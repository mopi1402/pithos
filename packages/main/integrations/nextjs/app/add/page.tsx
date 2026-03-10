import Link from 'next/link'
import AddForm from './_components/add-form'

export default function AddPage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Add a book</h1>
        <Link
          href="/collection"
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          ← Back to collection
        </Link>
      </div>
      <AddForm />
    </>
  )
}
