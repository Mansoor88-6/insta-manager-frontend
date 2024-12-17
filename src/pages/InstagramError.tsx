import { useNavigate } from 'react-router-dom'

export default function InstagramError() {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="error">
        <h2>Connection Failed</h2>
        <p>Failed to connect your Instagram account. Please try again.</p>
      </div>
      <button 
        className="instagram-connect-btn"
        onClick={() => navigate('/dashboard')}
      >
        Return to Dashboard
      </button>
    </div>
  )
} 