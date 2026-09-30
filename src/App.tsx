import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Results from './pages/Results'
import RoutePage from './pages/RoutePage'
import PlacePage from './pages/PlacePage'
import Business from './pages/Business'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ink">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/results" element={<Results />} />
            <Route path="/route/:id" element={<RoutePage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/business" element={<Business />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
