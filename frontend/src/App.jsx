import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [profile, setProfile] = useState(null)

  const handleLogin = async () => {
    const response = await fetch(
      'http://127.0.0.1:8000/api/auth/login/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    )

    const data = await response.json()

    setAccessToken(data.access)
    setRefreshToken(data.refresh)

    const profileResponse = await fetch(
      'http://127.0.0.1:8000/api/auth/profile/',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      }
    )

    const profileData = await profileResponse.json()

    setProfile(profileData)
  }

  if (profile) {
    return (
      <div className="app">
        <div className="profile-page">
          <h1>Welcome to OfferPipeline</h1>

          <div className="profile-card">
            <h2>Profile</h2>

            <p>Username: {profile.user}</p>
            <p>Bio: {profile.bio}</p>
            <p>Location: {profile.location}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="login-page">
        <div className="login-card">

          <div className="brand">
            <div className="brand-icon">
              OfferPipeline
            
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to continue managing your job search.
            </p>
          </div>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Sign in
          </button>

        </div>
      </div>
    </div>
  )
}

export default App