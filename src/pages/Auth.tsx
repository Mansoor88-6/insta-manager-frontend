import { useState } from 'react'
import Login from '../components/Auth/Login'
import SignUp from '../components/Auth/SignUp'

/**
 * Authentication page component:
 * - Manages login/signup view toggle
 * - Contains authentication forms
 * 
 * Flow:
 * - User can switch between login and signup
 * - Handles form submission and validation
 * - Redirects on successful authentication
 */
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page">
      {isLogin ? <Login /> : <SignUp />}
      <div className="auth-toggle-container">
        <button 
          className="toggle-auth-mode"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
} 