import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  const [profile, setProfile] = useState(null)
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = async () => {
    setLoginError('')

    try {
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

      if (!response.ok) {
        setLoginError('Invalid username or password.')
        return
      }

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

      if (!profileResponse.ok) {
        setLoginError('Unable to load your profile.')
        return
      }

      setProfile(profileData)
      setBio(profileData.bio || '')
      setLocation(profileData.location || '')
    } catch (error) {
      setLoginError('Unable to connect to the server.')
    }
  }

  const handleProfileUpdate = async () => {
    setIsSaving(true)
    setSaveMessage('')
    setSaveError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/profile/',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            bio: bio,
            location: location,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setSaveError('Failed to update profile.')
        return
      }

      setProfile(data)
      setSaveMessage('Profile updated successfully!')
    } catch (error) {
      setSaveError('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setProfile(null)
    setBio('')
    setLocation('')
    setSaveMessage('')
    setSaveError('')
  }

  if (profile) {
    return (
      <div className="app">
        <div className="profile-page">
          <h1>Welcome to OfferPipeline</h1>

          <div className="profile-card">
            <h2>Profile</h2>

            <p>Username: {profile.user}</p>

            <div className="form-group">
              <label>Bio</label>

              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              className="login-button"
              onClick={handleProfileUpdate}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>

            {saveMessage && <p>{saveMessage}</p>}

            {saveError && <p>{saveError}</p>}

            <button
              className="login-button"
              onClick={handleLogout}
            >
              Logout
            </button>
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

          {loginError && <p>{loginError}</p>}

        </div>
      </div>
    </div>
  )
}

export default App