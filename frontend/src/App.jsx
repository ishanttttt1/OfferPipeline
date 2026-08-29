import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken')
  )

  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refreshToken')
  )

  const [profile, setProfile] = useState(null)
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  const [companies, setCompanies] = useState([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const [companyError, setCompanyError] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [companyFormError, setCompanyFormError] = useState('')

  const [deletingCompanyId, setDeletingCompanyId] = useState(null)

  const [activeSection, setActiveSection] = useState('companies')

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [loginError, setLoginError] = useState('')

  const loadCompanies = async (token) => {
    setIsLoadingCompanies(true)
    setCompanyError('')

    try {
      const response = await fetch(`${API_BASE_URL}/companies/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setCompanyError('Unable to load your companies.')
        return
      }

      setCompanies(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      setCompanyError('Unable to connect to the server.')
    } finally {
      setIsLoadingCompanies(false)
    }
  }

  useEffect(() => {
    const restoreSession = async () => {
      if (!accessToken) {
        return
      }

      try {
        let tokenToUse = accessToken

        let profileResponse = await fetch(
          `${API_BASE_URL}/auth/profile/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenToUse}`,
            },
          }
        )

        if (profileResponse.status === 401 && refreshToken) {
          const refreshResponse = await fetch(
            `${API_BASE_URL}/auth/token/refresh/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh: refreshToken,
              }),
            }
          )

          if (!refreshResponse.ok) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            setAccessToken(null)
            setRefreshToken(null)
            return
          }

          const refreshData = await refreshResponse.json()

          tokenToUse = refreshData.access

          setAccessToken(tokenToUse)
          localStorage.setItem('accessToken', tokenToUse)

          profileResponse = await fetch(
            `${API_BASE_URL}/auth/profile/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${tokenToUse}`,
              },
            }
          )
        }

        if (!profileResponse.ok) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')

          setAccessToken(null)
          setRefreshToken(null)
          return
        }

        const profileData = await profileResponse.json()

        setProfile(profileData)
        setBio(profileData.bio || '')
        setLocation(profileData.location || '')

        await loadCompanies(tokenToUse)
      } catch (error) {
        console.error('Unable to restore session:', error)
      }
    }

    restoreSession()
  }, [accessToken, refreshToken])

  const handleLogin = async () => {
    setLoginError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoginError('Invalid username or password.')
        return
      }

      setAccessToken(data.access)
      setRefreshToken(data.refresh)

      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)

      const profileResponse = await fetch(
        `${API_BASE_URL}/auth/profile/`,
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

      await loadCompanies(data.access)
    } catch (error) {
      setLoginError('Unable to connect to the server.')
    }
  }

  const handleProfileUpdate = async () => {
    setIsSavingProfile(true)
    setSaveMessage('')
    setSaveError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          bio,
          location,
        }),
      })

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
      setIsSavingProfile(false)
    }
  }

  const openCreateCompanyModal = () => {
    setEditingCompany(null)
    setCompanyName('')
    setCompanyWebsite('')
    setCompanyLocation('')
    setCompanyFormError('')
    setIsCompanyModalOpen(true)
  }

  const openEditCompanyModal = (company) => {
    setEditingCompany(company)
    setCompanyName(company.name || '')
    setCompanyWebsite(company.website || '')
    setCompanyLocation(company.location || '')
    setCompanyFormError('')
    setIsCompanyModalOpen(true)
  }

  const closeCompanyModal = () => {
    if (isSavingCompany) {
      return
    }

    setIsCompanyModalOpen(false)
    setEditingCompany(null)
    setCompanyName('')
    setCompanyWebsite('')
    setCompanyLocation('')
    setCompanyFormError('')
  }

  const handleCompanySubmit = async (event) => {
    event.preventDefault()

    setCompanyFormError('')
    setIsSavingCompany(true)

    const companyPayload = {
      name: companyName.trim(),
      website: companyWebsite.trim(),
      location: companyLocation.trim(),
    }

    if (!companyPayload.name) {
      setCompanyFormError('Company name is required.')
      setIsSavingCompany(false)
      return
    }

    try {
      const isEditing = Boolean(editingCompany)

      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/companies/${editingCompany.id}/`
          : `${API_BASE_URL}/companies/`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(companyPayload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (typeof data === 'object' && data !== null) {
          const firstError = Object.values(data).flat()[0]

          setCompanyFormError(
            firstError || 'Unable to save this company.'
          )
        } else {
          setCompanyFormError('Unable to save this company.')
        }

        return
      }

      if (isEditing) {
        setCompanies((currentCompanies) =>
          currentCompanies.map((company) =>
            company.id === data.id ? data : company
          )
        )
      } else {
        setCompanies((currentCompanies) => [
          data,
          ...currentCompanies,
        ])
      }

      closeCompanyModal()
    } catch (error) {
      setCompanyFormError('Unable to connect to the server.')
    } finally {
      setIsSavingCompany(false)
    }
  }

  const handleDeleteCompany = async (company) => {
    const confirmed = window.confirm(
      `Delete "${company.name}"? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setDeletingCompanyId(company.id)
    setCompanyError('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/companies/${company.id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        setCompanyError('Unable to delete this company.')
        return
      }

      setCompanies((currentCompanies) =>
        currentCompanies.filter(
          (currentCompany) => currentCompany.id !== company.id
        )
      )
    } catch (error) {
      setCompanyError('Unable to connect to the server.')
    } finally {
      setDeletingCompanyId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    setAccessToken(null)
    setRefreshToken(null)

    setProfile(null)
    setBio('')
    setLocation('')

    setCompanies([])
    setCompanyError('')

    setIsCompanyModalOpen(false)
    setEditingCompany(null)

    setActiveSection('companies')

    setSaveMessage('')
    setSaveError('')
    setLoginError('')
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Recently added'
    }

    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (profile) {
    return (
      <div className="app dashboard-app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">OP</div>

            <div>
              <strong>OfferPipeline</strong>
              <span>Career workspace</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <p className="nav-label">Workspace</p>

            <button
              className={`nav-item ${
                activeSection === 'companies' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('companies')}
            >
              <span className="nav-icon">▦</span>
              Companies
            </button>

            <button
              className={`nav-item ${
                activeSection === 'profile' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">◉</span>
              Profile
            </button>
          </nav>

          <div className="sidebar-bottom">
            <div className="user-mini-card">
              <div className="avatar">
                {profile.user?.charAt(0).toUpperCase()}
              </div>

              <div className="user-mini-info">
                <strong>{profile.user}</strong>
                <span>Account</span>
              </div>
            </div>

            <button
              className="sidebar-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <p className="eyebrow">OfferPipeline workspace</p>

              <h1>
                {activeSection === 'companies'
                  ? 'Companies'
                  : 'Your profile'}
              </h1>
            </div>

            {activeSection === 'companies' && (
              <button
                className="primary-action"
                onClick={openCreateCompanyModal}
              >
                <span>+</span>
                Add company
              </button>
            )}
          </header>

          {activeSection === 'companies' && (
            <section className="dashboard-content">
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon">▦</div>

                  <div>
                    <span>Total companies</span>
                    <strong>{companies.length}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon purple">✓</div>

                  <div>
                    <span>Tracked workspace</span>
                    <strong>Active</strong>
                  </div>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Your companies</h2>
                  <p>
                    Manage the companies you're targeting in your job search.
                  </p>
                </div>
              </div>

              {companyError && (
                <div className="alert error-alert">
                  <strong>Something went wrong</strong>
                  <span>{companyError}</span>

                  <button
                    onClick={() => loadCompanies(accessToken)}
                  >
                    Try again
                  </button>
                </div>
              )}

              {isLoadingCompanies ? (
                <div className="company-grid">
                  {[1, 2, 3].map((item) => (
                    <div
                      className="company-card skeleton-card"
                      key={item}
                    >
                      <div className="skeleton skeleton-logo" />
                      <div className="skeleton skeleton-title" />
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line short" />
                    </div>
                  ))}
                </div>
              ) : companies.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▦</div>

                  <h3>No companies yet</h3>

                  <p>
                    Start building your company pipeline by adding the first
                    company you're targeting.
                  </p>

                  <button
                    className="primary-action"
                    onClick={openCreateCompanyModal}
                  >
                    <span>+</span>
                    Add your first company
                  </button>
                </div>
              ) : (
                <div className="company-grid">
                  {companies.map((company) => (
                    <article
                      className="company-card"
                      key={company.id}
                    >
                     <div className="company-logo">
                    {company.website ? (
                   <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                  company.website
                )}&sz=128`}
                alt={`${company.name} logo`}
                onError={(event) => {
               event.currentTarget.style.display = 'none'
              }}
              />
              ) : (
            company.name?.charAt(0).toUpperCase()
          )}

                        <div className="company-actions">
                          <button
                            className="icon-button"
                            title="Edit company"
                            onClick={() =>
                              openEditCompanyModal(company)
                            }
                          >
                            ✎
                          </button>

                          <button
                            className="icon-button danger"
                            title="Delete company"
                            disabled={
                              deletingCompanyId === company.id
                            }
                            onClick={() =>
                              handleDeleteCompany(company)
                            }
                          >
                            {deletingCompanyId === company.id
                              ? '…'
                              : '×'}
                          </button>
                        </div>
                      </div>

                      <div className="company-card-body">
                        <h3>{company.name}</h3>

                        {company.location ? (
                          <p className="company-meta">
                            <span>⌖</span>
                            {company.location}
                          </p>
                        ) : (
                          <p className="company-meta muted">
                            <span>⌖</span>
                            Location not added
                          </p>
                        )}

                        {company.website ? (
                          <a
                            className="company-website"
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>↗</span>
                            Visit website
                          </a>
                        ) : (
                          <span className="company-website disabled">
                            No website added
                          </span>
                        )}
                      </div>

                      <div className="company-card-footer">
                        <span>
                          Added {formatDate(company.created_at)}
                        </span>

                        <span className="company-status">
                          Active
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'profile' && (
            <section className="profile-content">
              <div className="profile-hero">
                <div className="profile-avatar-large">
                  {profile.user?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="eyebrow">Account settings</p>
                  <h2>{profile.user}</h2>
                  <p>
                    Keep your OfferPipeline profile up to date.
                  </p>
                </div>
              </div>

              <div className="profile-settings-card">
                <div className="settings-heading">
                  <h3>Profile information</h3>
                  <p>
                    Update the information associated with your account.
                  </p>
                </div>

                <div className="profile-fields">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={profile.user}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>

                    <input
                      type="text"
                      value={bio}
                      onChange={(e) =>
                        setBio(e.target.value)
                      }
                      placeholder="Tell us a little about yourself"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>

                    <input
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="Where are you based?"
                    />
                  </div>
                </div>

                <div className="profile-save-row">
                  <div>
                    {saveMessage && (
                      <span className="success-message">
                        {saveMessage}
                      </span>
                    )}

                    {saveError && (
                      <span className="error-message">
                        {saveError}
                      </span>
                    )}
                  </div>

                  <button
                    className="primary-action"
                    onClick={handleProfileUpdate}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile
                      ? 'Saving...'
                      : 'Save changes'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>

        {isCompanyModalOpen && (
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeCompanyModal()
              }
            }}
          >
            <div className="company-modal">
              <div className="modal-header">
                <div>
                  <p className="eyebrow">
                    {editingCompany
                      ? 'Company settings'
                      : 'New company'}
                  </p>

                  <h2>
                    {editingCompany
                      ? 'Edit company'
                      : 'Add a company'}
                  </h2>

                  <p>
                    {editingCompany
                      ? 'Update the company information below.'
                      : 'Add a company to your OfferPipeline workspace.'}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeCompanyModal}
                  disabled={isSavingCompany}
                >
                  ×
                </button>
              </div>

              <form
                className="company-form"
                onSubmit={handleCompanySubmit}
              >
                <div className="form-group">
                  <label htmlFor="company-name">
                    Company name
                  </label>

                  <input
                    id="company-name"
                    type="text"
                    placeholder="e.g. Google"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company-website">
                    Website
                  </label>

                  <input
                    id="company-website"
                    type="url"
                    placeholder="https://example.com"
                    value={companyWebsite}
                    onChange={(e) =>
                      setCompanyWebsite(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company-location">
                    Location
                  </label>

                  <input
                    id="company-location"
                    type="text"
                    placeholder="e.g. Bengaluru, India"
                    value={companyLocation}
                    onChange={(e) =>
                      setCompanyLocation(e.target.value)
                    }
                  />
                </div>

                {companyFormError && (
                  <div className="form-error">
                    {companyFormError}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={closeCompanyModal}
                    disabled={isSavingCompany}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={isSavingCompany}
                  >
                    {isSavingCompany
                      ? 'Saving...'
                      : editingCompany
                        ? 'Save changes'
                        : '+ Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Sign in
          </button>

          {loginError && (
            <p className="login-error">
              {loginError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App