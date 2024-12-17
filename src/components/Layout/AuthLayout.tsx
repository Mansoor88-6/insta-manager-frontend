import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Layout component for authentication routes:
 * - Manages authentication state
 * - Handles redirects for authenticated users
 * 
 * Flow:
 * - Checks if user is already authenticated
 * - Redirects to dashboard if authenticated
 * - Renders auth-related components if not authenticated
 */
export default function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
} 