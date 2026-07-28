import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Spinner } from './components/ui'
import { BottomNav } from './components/BottomNav'
import { getUnreadCount, subscribeToIncomingMessages } from './lib/api'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Workouts } from './pages/Workouts'
import { SessionLogger } from './pages/SessionLogger'
import { Progress } from './pages/Progress'
import { Hydration } from './pages/Hydration'
import { Couple } from './pages/Couple'
import { Ranks } from './pages/Ranks'
import { ExerciseDetail } from './pages/ExerciseDetail'
import { Messages } from './pages/Messages'
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
  const { profile } = useAuth()
  const [unread, setUnread] = useState(0)
  const location = useLocation()

  useEffect(() => {
    if (!profile) return
    getUnreadCount(profile.id).then(setUnread)
    const unsubscribe = subscribeToIncomingMessages(profile.id, () => setUnread((n) => n + 1))
    return unsubscribe
  }, [profile])

  useEffect(() => {
    if (location.pathname === '/messages' && profile) {
      setUnread(0)
    }
  }, [location.pathname, profile])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
      <span className="font-semibold text-slate-100">Duo Fit</span>
      <div className="flex items-center gap-3">
        <Link to="/messages" className="relative text-slate-400 text-lg leading-none">
          💬
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <Link to="/settings" className="text-slate-400 text-lg leading-none">
          ⚙️
        </Link>
      </div>
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
        <Route path="/ranks" element={<Ranks />} />
        <Route path="/exercise/:exerciseId" element={<ExerciseDetail />} />
        <Route path="/messages" element={<Messages />} />
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
