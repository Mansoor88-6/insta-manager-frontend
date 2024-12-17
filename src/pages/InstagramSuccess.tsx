import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InstagramSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="auth-container">
      <div className="success">
        <h2>Success!</h2>
        <p>Your Instagram account has been successfully connected.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  )
} 