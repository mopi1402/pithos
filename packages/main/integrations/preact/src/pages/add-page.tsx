import { AddForm } from '../components/add-form'

export function AddPage() {
  return (
    <>
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-semibold">Add a book</h1>
        <a href="/collection" class="text-sm text-zinc-500 hover:text-zinc-700">
          ← Back to collection
        </a>
      </div>
      <AddForm />
    </>
  )
}
