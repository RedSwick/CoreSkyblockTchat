import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Spinner } from './components/ui'
import { BottomNav } from './components/BottomNav'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Workouts } from './pages/Workouts'
import { SessionLogger } from './pages/SessionLogger'
import { Progress } from './pages/Progress'
import { Hydration } from './pages/Hydration'
import { Couple } from './pages/Couple'
import { Settings } from './pages/Settings'

function Gate({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!session) return <Navigate to="/login" replace />
  if (!profile?.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}

function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
      <span className="font-semibold text-slate-100">Duo Fit</span>
      <Link to="/settings" className="text-slate-400 text-lg leading-none">
        ⚙️
      </Link>
    </header>
  )
}

function Shell() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/session/:sessionId" element={<SessionLogger />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/hydration" element={<Hydration />} />
        <Route path="/couple" element={<Couple />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

function AppRoutes() {
  const { session, profile, loading } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={session && profile?.onboarded ? <Navigate to="/" replace /> : loading ? <Spinner /> : <Login />}
      />
      <Route
        path="/onboarding"
        element={
          <Gate>
            <Onboarding />
          </Gate>
        }
      />
      <Route
        path="/*"
        element={
          <Gate>
            <Shell />
          </Gate>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
