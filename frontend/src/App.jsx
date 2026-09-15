import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

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

  const [applications, setApplications] = useState([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)
  const [applicationError, setApplicationError] = useState('')
  const [statusHistory, setStatusHistory] = useState({})
  const [loadingStatusHistory, setLoadingStatusHistory] = useState({})
  const [statusHistoryErrors, setStatusHistoryErrors] = useState({})
  const [expandedApplicationId, setExpandedApplicationId] = useState(null)

  const [applicationPosition, setApplicationPosition] = useState('')
  const [applicationCompany, setApplicationCompany] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('applied')
  const [applicationAppliedAt, setApplicationAppliedAt] = useState('')
  const [applicationNotes, setApplicationNotes] = useState('')

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState(null)
  const [isSavingApplication, setIsSavingApplication] = useState(false)
  const [applicationFormError, setApplicationFormError] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [companyFormError, setCompanyFormError] = useState('')

  const [deletingCompanyId, setDeletingCompanyId] = useState(null)

  const [activeSection, setActiveSection] = useState(
  () => localStorage.getItem('activeSection') || 'companies'
)
  useEffect(() => {
  localStorage.setItem('activeSection', activeSection)
}, [activeSection])

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [loginError, setLoginError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [isRegisteringUser, setIsRegisteringUser] = useState(false)

  const [isRestoringSession, setIsRestoringSession] = useState(
    Boolean(accessToken)
  )

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
  const loadStatusHistory = async (applicationId) => {
    setLoadingStatusHistory((current) => ({
      ...current,
      [applicationId]: true,
    }))

    setStatusHistoryErrors((current) => ({
      ...current,
      [applicationId]: '',
    }))

    try {
      const response = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/status-history/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setStatusHistoryErrors((current) => ({
          ...current,
          [applicationId]: 'Unable to load status history.',
        }))
        return
      }

      setStatusHistory((current) => ({
        ...current,
        [applicationId]: Array.isArray(data)
          ? data
          : data.results || [],
      }))
    } catch (error) {
      setStatusHistoryErrors((current) => ({
        ...current,
        [applicationId]: 'Unable to connect to the server.',
      }))
    } finally {
      setLoadingStatusHistory((current) => ({
        ...current,
        [applicationId]: false,
      }))
    }
  }
  const toggleApplicationTimeline = async (applicationId) => {
  const isCurrentlyOpen = expandedApplicationId === applicationId

  if (isCurrentlyOpen) {
    setExpandedApplicationId(null)
    return
  }

  setExpandedApplicationId(applicationId)

  if (!statusHistory[applicationId]) {
    await loadStatusHistory(applicationId)
  }
}
  const loadApplications = async (token) => {
    setIsLoadingApplications(true)
    setApplicationError('')

    try {
      const response = await fetch(`${API_BASE_URL}/applications/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setApplicationError('Unable to load your applications.')
        return
      }

      setApplications(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      setApplicationError('Unable to connect to the server.')
    } finally {
      setIsLoadingApplications(false)
    }
  }
  useEffect(() => {
    const restoreSession = async () => {
      if (!accessToken) {
        setIsRestoringSession(false)
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
            setIsRestoringSession(false)
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
          setIsRestoringSession(false)
          return
        }

        const profileData = await profileResponse.json()

        setProfile(profileData)
        setBio(profileData.bio || '')
        setLocation(profileData.location || '')

        await loadCompanies(tokenToUse)
        await loadApplications(tokenToUse)
      } catch (error) {
        console.error('Unable to restore session:', error)
      } finally {
        setIsRestoringSession(false)
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
      await loadApplications(data.access)
    } catch (error) {
      setLoginError('Unable to connect to the server.')
    }
  }

  const handleRegister = async () => {
    setRegisterError('')
    setRegisterMessage('')

    if (!username.trim() || !email.trim() || !password) {
      setRegisterError('Username, email, and password are required.')
      return
    }

    setIsRegisteringUser(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (typeof data === 'object' && data !== null) {
          const firstError = Object.values(data).flat()[0]

          setRegisterError(
            firstError || 'Unable to create your account.'
          )
        } else {
          setRegisterError('Unable to create your account.')
        }

        return
      }

      setRegisterMessage(
        'Account created successfully. You can now sign in.'
      )

      setPassword('')
      setEmail('')
      setIsRegistering(false)
    } catch (error) {
      setRegisterError('Unable to connect to the server.')
    } finally {
      setIsRegisteringUser(false)
    }
  }

  const switchToRegister = () => {
    setIsRegistering(true)
    setLoginError('')
    setRegisterError('')
    setRegisterMessage('')
  }

  const switchToLogin = () => {
    setIsRegistering(false)
    setLoginError('')
    setRegisterError('')
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
  const openEditApplicationModal = (application) => {
  setEditingApplication(application)
  setApplicationPosition(application.position || '')
  setApplicationCompany(
    typeof application.company === 'object'
      ? String(application.company?.id || '')
      : String(application.company || '')
  )
  setApplicationStatus(application.status || 'applied')
  setApplicationAppliedAt(application.applied_at || '')
  setApplicationNotes(application.notes || '')
  setApplicationFormError('')
  setIsApplicationModalOpen(true)
}
  const openCreateApplicationModal = () => {
    setEditingApplication(null)
    setApplicationPosition('')
    setApplicationCompany('')
    setApplicationStatus('applied')
    setApplicationAppliedAt('')
    setApplicationNotes('')
    setApplicationFormError('')
    setIsApplicationModalOpen(true)
  }

  const closeApplicationModal = () => {
    if (isSavingApplication) {
      return
    }

    setIsApplicationModalOpen(false)
    setEditingApplication(null)
    setApplicationPosition('')
    setApplicationCompany('')
    setApplicationStatus('applied')
    setApplicationAppliedAt('')
    setApplicationNotes('')
    setApplicationFormError('')
  }

 const handleApplicationSubmit = async (event) => {
  event.preventDefault()

  setApplicationFormError('')

  const applicationPayload = {
    company: applicationCompany,
    position: applicationPosition.trim(),
    status: applicationStatus,
    applied_at: applicationAppliedAt,
    notes: applicationNotes.trim(),
  }

  if (!applicationPayload.company) {
    setApplicationFormError('Please select a company.')
    return
  }

  if (!applicationPayload.position) {
    setApplicationFormError('Position is required.')
    return
  }

  if (!applicationPayload.applied_at) {
    setApplicationFormError('Application date is required.')
    return
  }

  const isEditing = Boolean(editingApplication)

  setIsSavingApplication(true)

  try {
    const response = await fetch(
      isEditing
        ? `${API_BASE_URL}/applications/${editingApplication.id}/`
        : `${API_BASE_URL}/applications/`,
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(applicationPayload),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (typeof data === 'object' && data !== null) {
        const firstError = Object.values(data).flat()[0]

        setApplicationFormError(
          firstError || 'Unable to save this application.'
        )
      } else {
        setApplicationFormError('Unable to save this application.')
      }

      return
    }

    if (isEditing) {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === data.id ? data : application
        )
      )
    } else {
      setApplications((currentApplications) => [
        data,
        ...currentApplications,
      ])
    }

    closeApplicationModal()
  } catch (error) {
    setApplicationFormError('Unable to connect to the server.')
  } finally {
    setIsSavingApplication(false)
  }
}
const handleApplicationDelete = async (application) => {
  const confirmed = window.confirm(
    `Delete the application for ${application.position}?`
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${application.id}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      setApplicationError('Unable to delete this application.')
      return
    }

    setApplications((currentApplications) =>
      currentApplications.filter(
        (currentApplication) =>
          currentApplication.id !== application.id
      )
    )
  } catch (error) {
    setApplicationError('Unable to connect to the server.')
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

    setApplications([])
    setApplicationError('')

    setIsCompanyModalOpen(false)
    setEditingCompany(null)

    setActiveSection('companies')

    setSaveMessage('')
    setSaveError('')
    setLoginError('')
  }
const getStatusClassName = (status) => {
  const map = {
    applied: 'applied',
    oa: 'oa',
    interview: 'interview',
    offer: 'offer',
    rejected: 'rejected',
    withdrawn: 'withdrawn',
  }

  return map[status?.toLowerCase()] || 'applied'
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

  if (isRestoringSession) {
    return (
      <div className="app">
        <div className="login-page">
          <div className="login-card">
            <div className="brand">
              <div className="brand-icon">
                OfferPipeline
              </div>

              <h1>Restoring your session...</h1>

              <p>
                Please wait while we load your workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
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
    activeSection === 'applications' ? 'active' : ''
  }`}
  onClick={() => setActiveSection('applications')}
>
  <span className="nav-icon">✓</span>
  Applications
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
  : activeSection === 'applications'
    ? 'Applications'
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

{activeSection === 'applications' && (
  <button
    className="primary-action"
    onClick={openCreateApplicationModal}
  >
    <span>+</span>
    Add application
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
                     <div className="company-card-top">
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
  </div>

  <div className="company-actions">
    <button
      type="button"
      className="icon-button"
      title="Edit company"
      aria-label={`Edit ${company.name}`}
      onClick={() =>
        openEditCompanyModal(company)
      }
    >
      ✎
    </button>

    <button
      type="button"
      className="icon-button danger"
      title="Delete company"
      aria-label={`Delete ${company.name}`}
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
          {activeSection === 'applications' && (
            <section className="dashboard-content">
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon">✓</div>

                  <div>
                    <span>Total applications</span>
                    <strong>{applications.length}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon purple">▦</div>

                  <div>
                    <span>Companies targeted</span>
                    <strong>
                      {new Set(
                        applications
                          .map((application) =>
                            typeof application.company === 'object'
                              ? application.company?.id
                              : application.company
                          )
                          .filter(Boolean)
                      ).size}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Your applications</h2>
                  <p>
                    Track and manage the jobs you're applying to.
                  </p>
                </div>
              </div>

              {applicationError && (
                <div className="alert error-alert">
                  <strong>Something went wrong</strong>
                  <span>{applicationError}</span>

                  <button onClick={() => loadApplications(accessToken)}>
                    Try again
                  </button>
                </div>
              )}

              {isLoadingApplications ? (
                <div className="company-grid">
                  {[1, 2, 3].map((item) => (
                    <div
                      className="company-card skeleton-card"
                      key={item}
                    >
                      <div className="skeleton skeleton-title" />
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line short" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>

                  <h3>No applications yet</h3>

                  <p>
                    Your job applications will appear here once you start
                    tracking them.
                  </p>
                </div>
              ) : (
                <div className="company-grid">
                  {applications.map((application) => {
                    const isTimelineOpen =
  expandedApplicationId === application.id
                    const companyId =
                      typeof application.company === 'object'
                        ? application.company?.id
                        : application.company

                    const company = companies.find(
                      (item) => item.id === companyId
                    )

                    const companyName =
                      application.company?.name ||
                      application.company_name ||
                      company?.name ||
                      'Company not found'

                    const applicationTitle =
                      application.job_title ||
                      application.position ||
                      application.title ||
                      'Untitled position'

                    const status =
                      application.status || 'Applied'

                    return (
                      <article
                        className="application-card"
                        key={application.id}
                      >
                        <div className="company-card-top">
                          <div className="company-logo">
                            {companyName.charAt(0).toUpperCase()}
                          </div>

                          <div className="company-actions">
                            <button
                              type="button"
                              className="icon-button"
                              title="Edit application"
                              aria-label={`Edit ${applicationTitle}`}
                              onClick={() => openEditApplicationModal(application)}
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              className="icon-button danger"
                              title="Delete application"
                              aria-label={`Delete ${applicationTitle}`}
                              onClick={() => handleApplicationDelete(application)}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div className="company-card-body">
                          <h3>{applicationTitle}</h3>

                          <p className="company-meta">
                            <span>▦</span>
                            {companyName}
                          </p>

                          {application.location && (
                            <p className="company-meta">
                              <span>⌖</span>
                              {application.location}
                            </p>
                          )}

                          {application.status && (
                            <span className={`company-status ${getStatusClassName(status)}`}>
                              {status}
                            </span>
                          )}
                        </div>
                        <div className="application-timeline-trigger">
  <button
    type="button"
    onClick={() => toggleApplicationTimeline(application.id)}
    aria-expanded={isTimelineOpen}
    className="timeline-toggle"
  >
    <span>
      {isTimelineOpen ? 'Hide timeline' : 'View timeline'}
    </span>

    <span className="timeline-toggle-icon">
      {isTimelineOpen ? '↑' : '→'}
    </span>
  </button>
</div>
{isTimelineOpen && (
  <div className="application-timeline">
    {loadingStatusHistory[application.id] ? (
      <div className="timeline-loading">
        Loading status history...
      </div>
    ) : statusHistoryErrors[application.id] ? (
      <div className="timeline-error">
        <span>{statusHistoryErrors[application.id]}</span>

        <button
          type="button"
          onClick={() => loadStatusHistory(application.id)}
        >
          Retry
        </button>
      </div>
    ) : statusHistory[application.id]?.length === 0 ? (
      <div className="timeline-empty">
        No status history available yet.
      </div>
    ) : (
      <div className="timeline-list">
        {statusHistory[application.id]?.map((entry) => (
          <div
            className="timeline-item"
            key={entry.id}
          >
            <div className={`timeline-dot ${getStatusClassName(entry.status)}`}
/>

            <div className="timeline-content">
              <strong>
  {entry.status === 'oa'
    ? 'OA'
    : entry.status?.charAt(0).toUpperCase() +
      entry.status?.slice(1)}
</strong>
              <span>
                {formatDate(entry.changed_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
                        <div className="company-card-footer">
                          <span>
                            Added {formatDate(application.created_at)}
                          </span>

                          <span className="company-status">
                            {status}
                          </span>
                        </div>
                      </article>
                    )
                  })}
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
        {isApplicationModalOpen && (
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeApplicationModal()
              }
            }}
          >
            <div className="company-modal">
              <div className="modal-header">
                <div>
                  <p className="eyebrow">New application</p>

                  <h2>Add an application</h2>

                  <p>
                    Track a new job application in your OfferPipeline workspace.
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeApplicationModal}
                  disabled={isSavingApplication}
                >
                  ×
                </button>
              </div>

              <form
                className="company-form"

                 onSubmit={handleApplicationSubmit} 
> 
  <div className="form-group">

    <label htmlFor="application-company"> 
      Company <span className="required">*</span> 
    </label> 
 
    <select 
      id="application-company" 
      value={applicationCompany} 
      onChange={(e) => 
        setApplicationCompany(e.target.value) 
      } 
      autoFocus 
    >
                  
                    <option value="">Select a company</option>

                    {companies.map((company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <p className="field-helper company-helper">
  Don't see your company? Add it in Companies first.
</p>
                </div>

                <div className="form-group">
                   <label htmlFor="application-position">
         Position <span className="required">*</span>
                  </label>

                  <input
                    id="application-position"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={applicationPosition}
                    onChange={(e) =>
                      setApplicationPosition(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="application-status">
  Status <span className="required">*</span>
                  </label>

                  <select
                    id="application-status"
                    value={applicationStatus}
                    onChange={(e) =>
                      setApplicationStatus(e.target.value)
                    }
                  >
                    <option value="applied">Applied</option>
                    <option value="oa">OA</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="application-applied-at">
                  Applied date <span className="required">*</span>
                  </label>

                  <input
                    id="application-applied-at"
                    type="date"
                     max={new Date().toLocaleDateString("en-CA")}
                    value={applicationAppliedAt}
                    onChange={(e) =>
                      setApplicationAppliedAt(e.target.value)
                    }
                  />
                  <p className="field-helper">
  Select the date you applied.
</p>
<p className="date-validation-helper">
  <span>ⓘ</span>
  This date should be today or in the past.
</p>
                </div>

                <div className="form-group">
                  <label htmlFor="application-notes">
                    Notes
                  </label>

                  <textarea
                    id="application-notes"
                    placeholder="Add any useful notes..."
                    value={applicationNotes}
                    onChange={(e) =>
                      setApplicationNotes(e.target.value)
                    }
                    rows="4"
                  />
                   <div className="notes-counter">
                    {applicationNotes.length}/500
                  </div>
                </div>

                {applicationFormError && (
                  <div className="form-error">
                    {applicationFormError}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={closeApplicationModal}
                    disabled={isSavingApplication}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={isSavingApplication}
                  >
                    {isSavingApplication
                      ? 'Saving...'
                      : '+ Add Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

  <span className="auth-eyebrow">
    {isRegistering ? 'GET STARTED' : 'WELCOME BACK'}
  </span>

  <h1>
    {isRegistering
      ? 'Create your account'
      : 'Welcome back'}
  </h1>

  <p>
    {isRegistering
      ? 'Build your workspace and start managing your job search.'
      : 'Sign in to continue managing your job search.'}
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
              autoComplete="username"
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete={
                isRegistering
                  ? 'new-password'
                  : 'current-password'
              }
            />
          </div>

          <button
            className="login-button"
            onClick={
              isRegistering
                ? handleRegister
                : handleLogin
            }
            disabled={isRegisteringUser}
          >
            {isRegisteringUser
              ? 'Creating account...'
              : isRegistering
                ? 'Create account'
                : 'Sign in'}
          </button>

          {loginError && !isRegistering && (
            <p className="login-error">
              {loginError}
            </p>
          )}

          {registerError && isRegistering && (
            <p className="login-error">
              {registerError}
            </p>
          )}

          {registerMessage && !isRegistering && (
            <p className="success-message">
              {registerMessage}
            </p>
          )}

          <div className="auth-switch">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={switchToRegister}
                >
                  Create account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App