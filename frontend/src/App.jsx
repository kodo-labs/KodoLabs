import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ReservationsProvider } from './context/ReservationsContext'
import { ResourcesProvider } from './context/ResourcesContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BookingPage from './pages/BookingPage'
import ReservationsPage from './pages/ReservationsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminResourcesPage from './pages/admin/AdminResourcesPage'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservations"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/resources"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminResourcesPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ResourcesProvider>
        <ReservationsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ReservationsProvider>
      </ResourcesProvider>
    </AuthProvider>
  )
}
