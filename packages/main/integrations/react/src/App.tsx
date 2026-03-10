import { Routes, Route } from 'react-router'
import { NavBar } from './components/nav-bar'
import { AddPage } from './pages/add-page'
import { CollectionPage } from './pages/collection-page'

export function App() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <Routes>
          <Route path="/add" element={<AddPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/" element={<CollectionPage />} />
        </Routes>
      </main>
    </>
  )
}
