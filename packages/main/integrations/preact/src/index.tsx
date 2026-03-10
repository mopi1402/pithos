import { render } from 'preact'
import { LocationProvider, Router, Route } from 'preact-iso'
import { NavBar } from './components/nav-bar'
import { AddPage } from './pages/add-page'
import { CollectionPage } from './pages/collection-page'
import './style.css'

export function App() {
  return (
    <LocationProvider>
      <NavBar />
      <main class="mx-auto max-w-3xl px-6 py-8">
        <Router>
          <Route path="/add" component={AddPage} />
          <Route path="/collection" component={CollectionPage} />
          <Route path="/" component={CollectionPage} />
        </Router>
      </main>
    </LocationProvider>
  )
}

render(<App />, document.getElementById('app'))
