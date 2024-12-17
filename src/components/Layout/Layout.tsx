import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

/**
 * Main layout component for authenticated routes:
 * - Handles authentication check
 * - Provides consistent layout structure
 * - Manages navigation and header
 * 
 * Flow:
 * - Checks authentication status
 * - Redirects to auth if not authenticated
 * - Renders child routes within layout structure
 */
export default function Layout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="layout">
      <header>
        <nav>
          <h1>Instagram Manager</h1>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
} 