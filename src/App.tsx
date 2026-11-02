import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Results from './pages/Results'
import RoutePage from './pages/RoutePage'
import PlacePage from './pages/PlacePage'
import Business from './pages/Business'
import Admin from './pages/Admin'
import Catalog from './pages/Catalog'
import MapPage from './pages/MapPage'
import MarkersPage from './pages/MarkersPage'
import Challenges from './pages/Challenges'
import ChallengePage from './pages/ChallengePage'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
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
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/markers" element={<MarkersPage />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:id" element={<ChallengePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/business" element={<Business />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
