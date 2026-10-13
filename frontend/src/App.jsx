  import { useEffect, useState } from 'react'
  import './App.css'

  const API_BASE_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000/api'
  : 'https://offerpipeline-production.up.railway.app/api';

  const APPLICATIONS_PAGE_SIZE = 10

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
    const [phone, setPhone] = useState('')
    const [headline, setHeadline] = useState('')
    const [university, setUniversity] = useState('')
    const [degree, setDegree] = useState('')
    const [graduationYear, setGraduationYear] = useState('')
    const [githubUrl, setGithubUrl] = useState('')
    const [linkedinUrl, setLinkedinUrl] = useState('')
    const [portfolioUrl, setPortfolioUrl] = useState('')
    const [openToWork, setOpenToWork] = useState(true)
    const [preferredRoles, setPreferredRoles] = useState('')
    const [preferredLocations, setPreferredLocations] = useState('')
    const [preferredWorkMode, setPreferredWorkMode] = useState('')
    const [expectedSalary, setExpectedSalary] = useState('')

    const [companies, setCompanies] = useState([])
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
    const [companyError, setCompanyError] = useState('')

    const [resumes, setResumes] = useState([])
    const [isLoadingResumes, setIsLoadingResumes] = useState(false)
    const [resumeError, setResumeError] = useState('')


    const [applications, setApplications] = useState([])
    const [isLoadingApplications, setIsLoadingApplications] = useState(false)
    const [applicationTotalCount, setApplicationTotalCount] = useState(0)
    const [applicationError, setApplicationError] = useState('')
    const [applicationSearch, setApplicationSearch] = useState('')
    const [applicationStatusFilter, setApplicationStatusFilter] = useState('')
    const [applicationCompanyFilter, setApplicationCompanyFilter] = useState('')
    const [applicationPage, setApplicationPage] = useState(() => Number(localStorage.getItem('applicationPage')) || 1)
    const [applicationTotalPages, setApplicationTotalPages] = useState(1)
    

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
    const [resumeFormError, setResumeFormError] = useState('')
    const [selectedResumeFile, setSelectedResumeFile] = useState(null)
    const [resumeName, setResumeName] = useState('')
    const [resumeVersion, setResumeVersion] = useState(1)
    const [isUploadingResume, setIsUploadingResume] = useState(false)

const [interviewRounds, setInterviewRounds] = useState([])

const [isLoadingInterviewRounds, setIsLoadingInterviewRounds] = useState(false)
const [interviewRoundError, setInterviewRoundError] = useState('')

const [interviewRoundNumber, setInterviewRoundNumber] = useState(1)
const [interviewRoundType, setInterviewRoundType] = useState('technical')
const [interviewRoundStatus, setInterviewRoundStatus] = useState('scheduled')
const [interviewRoundScheduledAt, setInterviewRoundScheduledAt] = useState('')
const [interviewRoundInterviewer, setInterviewRoundInterviewer] = useState('')
const [interviewRoundNotes, setInterviewRoundNotes] = useState('')
const [interviewRoundFeedback, setInterviewRoundFeedback] = useState('')

const [selectedInterviewApplication, setSelectedInterviewApplication] = useState('')
const [isSavingInterviewRound, setIsSavingInterviewRound] = useState(false)
const [editingInterviewRound, setEditingInterviewRound] = useState(null)
const [interviewRoundFormError, setInterviewRoundFormError] = useState('')

const [oaDeadlines, setOaDeadlines] = useState([])
const [isLoadingOaDeadlines, setIsLoadingOaDeadlines] = useState(false)
const [oaDeadlineError, setOaDeadlineError] = useState('')

const [oaDeadlineTitle, setOaDeadlineTitle] = useState('')
const [oaDeadlineApplication, setOaDeadlineApplication] = useState('')
const [oaDeadlineAt, setOaDeadlineAt] = useState('')
const [oaDeadlineUrl, setOaDeadlineUrl] = useState('')
const [oaDeadlineStatus, setOaDeadlineStatus] = useState('pending')
const [oaDeadlineNotes, setOaDeadlineNotes] = useState('')

const [isSavingOaDeadline, setIsSavingOaDeadline] = useState(false)
const [editingOaDeadline, setEditingOaDeadline] = useState(null)
const [oaDeadlineFormError, setOaDeadlineFormError] = useState('')

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
  const loadResumes = async (token) => {
  setIsLoadingResumes(true)
  setResumeError('')

  try {
    const response = await fetch(`${API_BASE_URL}/companies/resumes/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to load resumes')
    }

    const data = await response.json()
    setResumes(data.results || data)
  } catch (error) {
    setResumeError(error.message)
  } finally {
    setIsLoadingResumes(false)
  }
}

const loadInterviewRounds = async (token) => {
  setIsLoadingInterviewRounds(true)
  setInterviewRoundError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/interview-rounds/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to load interview rounds')
    }

    setInterviewRounds(data.results || data)
  } catch (error) {
    setInterviewRoundError(
      'Unable to load your interview rounds.'
    )
  } finally {
    setIsLoadingInterviewRounds(false)
  }
}

const loadOaDeadlines = async (token) => {
  setIsLoadingOaDeadlines(true)
  setOaDeadlineError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/oa-deadlines/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to load OA deadlines')
    }

    setOaDeadlines(data.results || data)
  } catch (error) {
    setOaDeadlineError(
      'Unable to load your OA deadlines.'
    )
  } finally {
    setIsLoadingOaDeadlines(false)
  }
}

const resetOaDeadlineForm = () => {
  setOaDeadlineTitle('')
  setOaDeadlineApplication('')
  setOaDeadlineAt('')
  setOaDeadlineUrl('')
  setOaDeadlineStatus('pending')
  setOaDeadlineNotes('')
  setEditingOaDeadline(null)
  setOaDeadlineFormError('')
}

const openCreateOaDeadline = () => {
  resetOaDeadlineForm()
}

const openEditOaDeadline = (deadline) => {
  setEditingOaDeadline(deadline)
  setOaDeadlineTitle(deadline.title || '')
  setOaDeadlineApplication(String(deadline.application))
  setOaDeadlineAt(
    deadline.deadline_at ? deadline.deadline_at.slice(0, 16) : ''
  )
  setOaDeadlineUrl(deadline.assessment_url || '')
  setOaDeadlineStatus(deadline.status || 'pending')
  setOaDeadlineNotes(deadline.notes || '')
  setOaDeadlineFormError('')
}

const handleOaDeadlineSubmit = async (event) => {
  event.preventDefault()

  if (!oaDeadlineTitle.trim()) {
    setOaDeadlineFormError('Please enter an assessment title.')
    return
  }

  if (!oaDeadlineApplication) {
    setOaDeadlineFormError('Please select a job application.')
    return
  }

  if (!oaDeadlineAt) {
    setOaDeadlineFormError('Please select the deadline date and time.')
    return
  }

  setIsSavingOaDeadline(true)
  setOaDeadlineFormError('')
  setOaDeadlineError('')

  try {
    const token = localStorage.getItem('accessToken')
    const isEditing = Boolean(editingOaDeadline)

    const payload = {
      application: Number(oaDeadlineApplication),
      title: oaDeadlineTitle.trim(),
      deadline_at: new Date(oaDeadlineAt).toISOString(),
      assessment_url: oaDeadlineUrl.trim(),
      status: oaDeadlineStatus,
      notes: oaDeadlineNotes.trim(),
    }

    const url = isEditing
      ? `${API_BASE_URL}/companies/oa-deadlines/${editingOaDeadline.id}/`
      : `${API_BASE_URL}/companies/oa-deadlines/`

    const response = await fetch(url, {
      method: isEditing ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail ||
        JSON.stringify(errorData) ||
        'Failed to save OA deadline.'
      )
    }

    await loadOaDeadlines(token)
    resetOaDeadlineForm()
  } catch (error) {
    setOaDeadlineFormError(error.message)
  } finally {
    setIsSavingOaDeadline(false)
  }
}

const handleOaDeadlineDelete = async (deadline) => {
  const confirmed = window.confirm(
    `Delete "${deadline.title}"? This action cannot be undone.`
  )

  if (!confirmed) return

  const token = localStorage.getItem('accessToken')

  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/oa-deadlines/${deadline.id}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail || 'Failed to delete OA deadline.'
      )
    }

    setOaDeadlines((current) =>
      current.filter((item) => item.id !== deadline.id)
    )

    if (editingOaDeadline?.id === deadline.id) {
      resetOaDeadlineForm()
    }

    setOaDeadlineError('')
  } catch (error) {
    setOaDeadlineError(error.message)
  }
}
const resetInterviewRoundForm = () => {
  setInterviewRoundNumber(1)
  setInterviewRoundType('technical')
  setInterviewRoundStatus('scheduled')
  setInterviewRoundScheduledAt('')
  setInterviewRoundInterviewer('')
  setInterviewRoundNotes('')
  setInterviewRoundFeedback('')
  setSelectedInterviewApplication('')
  setEditingInterviewRound(null)
  setInterviewRoundFormError('')
}

const openCreateInterviewRound = () => {
  resetInterviewRoundForm()
}

const openEditInterviewRound = (round) => {
  setEditingInterviewRound(round)
  setSelectedInterviewApplication(String(round.application))
  setInterviewRoundNumber(round.round_number)
  setInterviewRoundType(round.round_type)
  setInterviewRoundStatus(round.status)
  setInterviewRoundScheduledAt(
    round.scheduled_at
      ? round.scheduled_at.slice(0, 16)
      : ''
  )
  setInterviewRoundInterviewer(round.interviewer || '')
  setInterviewRoundNotes(round.notes || '')
  setInterviewRoundFeedback(round.feedback || '')
  setInterviewRoundFormError('')
}

const handleInterviewRoundSubmit = async (event) => {
  event.preventDefault()

  if (!selectedInterviewApplication) {
    setInterviewRoundFormError('Please select an application.')
    return
  }

  setIsSavingInterviewRound(true)
  setInterviewRoundFormError('')

  try {
    const token = localStorage.getItem('accessToken')
    const isEditing = Boolean(editingInterviewRound)

    const payload = {
      application: Number(selectedInterviewApplication),
      round_number: Number(interviewRoundNumber),
      round_type: interviewRoundType,
      status: interviewRoundStatus,
      scheduled_at: interviewRoundScheduledAt
        ? new Date(interviewRoundScheduledAt).toISOString()
        : null,
      interviewer: interviewRoundInterviewer.trim(),
      notes: interviewRoundNotes.trim(),
      feedback: interviewRoundFeedback.trim(),
    }

    const url = isEditing
      ? `${API_BASE_URL}/companies/interview-rounds/${editingInterviewRound.id}/`
      : `${API_BASE_URL}/companies/interview-rounds/`

    const response = await fetch(url, {
      method: isEditing ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail ||
        JSON.stringify(errorData) ||
        'Failed to save interview round.'
      )
    }
    await loadInterviewRounds(token)
    resetInterviewRoundForm()
  } catch (error) {
    setInterviewRoundFormError(error.message)
  } finally {
    setIsSavingInterviewRound(false)
  }
}
const handleInterviewRoundDelete = async (round) => {
  const confirmed = window.confirm(
    `Delete Interview Round ${round.round_number}? This action cannot be undone.`
  )

  if (!confirmed) return
    const token = localStorage.getItem('accessToken')

  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/interview-rounds/${round.id}/`,
      {
         method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail || 'Failed to delete interview round.'
      )
    }

    await loadInterviewRounds(token)
    setInterviewRoundError('')
  } catch (error) {
    setInterviewRoundError(error.message)
  }
}


const handleResumeUpload = async (event) => {
  event.preventDefault()

  if (!resumeName.trim()) {
    setResumeFormError('Please enter a resume name.')
    return
  }

  if (!selectedResumeFile) {
    setResumeFormError('Please select a resume file.')
    return
  }

  setIsUploadingResume(true)
  setResumeFormError('')

  try {
    const formData = new FormData()
    formData.append('name', resumeName.trim())
    formData.append('file', selectedResumeFile)
    formData.append('version', resumeVersion)

    const response = await fetch(
      `${API_BASE_URL}/companies/resumes/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail || 'Failed to upload resume'
      )
    }

    await loadResumes(localStorage.getItem('accessToken'))

    setResumeName('')
    setResumeVersion(1)
    setSelectedResumeFile(null)
    event.target.reset()
  } catch (error) {
    setResumeFormError(error.message)
  } finally {
    setIsUploadingResume(false)
  }
}

  const loadApplications = async (token,statusFilter = applicationStatusFilter,companyFilter = applicationCompanyFilter) => {
      setIsLoadingApplications(true)
      setApplicationError('')

      try {
      const params = new URLSearchParams()
      params.append('page', applicationPage)

      if (applicationSearch.trim()) {
        params.append('search', applicationSearch.trim())
      }
      if (statusFilter) {
    params.append('status', statusFilter)
  }
  if (companyFilter) {
    params.append('company',companyFilter)
  }
      const response = await fetch(
        `${API_BASE_URL}/applications/?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

        const data = await response.json()

        if (!response.ok) {
          setApplicationError('Unable to load your applications.')
          return
        }
        if (!Array.isArray(data)) {
    setApplicationTotalCount(data.count)

    setApplicationTotalPages(
      Math.max(1, Math.ceil(data.count / APPLICATIONS_PAGE_SIZE))
    )
  }
        setApplications(Array.isArray(data) ? data : data.results || [])
      } catch (error) {
        setApplicationError('Unable to connect to the server.')
      } finally {
        setIsLoadingApplications(false)
      }
    }
    useEffect(() => {
    if (!accessToken) return

    const timer = setTimeout(() => {
      loadApplications(accessToken)
    }, 400)

    return () => clearTimeout(timer)
  }, [applicationSearch,
    applicationPage,
    applicationStatusFilter,
    applicationCompanyFilter])
    useEffect(() => {
    localStorage.setItem('applicationPage', applicationPage)
  }, [applicationPage])

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
          setUsername(profileData.user || '')
          setBio(profileData.bio || '')
          setLocation(profileData.location || '')
          setPhone(profileData.phone || '')
  setHeadline(profileData.headline || '')
  setUniversity(profileData.university || '')
  setDegree(profileData.degree || '')
  setGraduationYear(profileData.graduation_year || '')
  setGithubUrl(profileData.github_url || '')
  setLinkedinUrl(profileData.linkedin_url || '')
  setPortfolioUrl(profileData.portfolio_url || '')
  setOpenToWork(profileData.open_to_work ?? true)
  setPreferredRoles(profileData.preferred_roles || '')
  setPreferredLocations(profileData.preferred_locations || '')
  setPreferredWorkMode(profileData.preferred_work_mode || '')
  setExpectedSalary(profileData.expected_salary || '')

          await loadCompanies(tokenToUse)
          await loadResumes(tokenToUse)
          await loadApplications(tokenToUse)
          await loadInterviewRounds(tokenToUse)
          await loadOaDeadlines(tokenToUse)
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
        setPhone(profileData.phone || '')
  setHeadline(profileData.headline || '')
  setUniversity(profileData.university || '')
  setDegree(profileData.degree || '')
  setGraduationYear(profileData.graduation_year || '')
  setGithubUrl(profileData.github_url || '')
  setLinkedinUrl(profileData.linkedin_url || '')
  setPortfolioUrl(profileData.portfolio_url || '')
  setOpenToWork(profileData.open_to_work ?? true)
  setPreferredRoles(profileData.preferred_roles || '')
  setPreferredLocations(profileData.preferred_locations || '')
  setPreferredWorkMode(profileData.preferred_work_mode || '')
  setExpectedSalary(profileData.expected_salary || '')

        await loadCompanies(data.access)
        await loadResumes(data.access)
        await loadApplications(data.access)
        await loadInterviewRounds(data.access)
        await loadOaDeadlines(data.access)
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
    if (
    graduationYear &&
    (Number(graduationYear) < 2020 || Number(graduationYear) > 2035)
  ) {
    setSaveError('Graduation year must be between 2020 and 2035.')
    setIsSavingProfile(false)

    document.getElementById('graduation_year')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    return
  }
    if (expectedSalary && Number(expectedSalary) < 50000) {
    setSaveError('Expected salary must be at least ₹50,000.')
    setIsSavingProfile(false)

    document.getElementById('expected_salary')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    return
  }
  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    setSaveError('Phone number must be a valid 10-digit Indian mobile number.')
    setIsSavingProfile(false)
    document.getElementById('phone')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    return
  }
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: username,
            bio,
  location,
  phone,
  headline,
  university,
  degree,
  graduation_year: graduationYear,
  github_url: githubUrl,
  linkedin_url: linkedinUrl,
  portfolio_url: portfolioUrl,
  open_to_work: openToWork,
  preferred_roles: preferredRoles,
  preferred_locations: preferredLocations,
  preferred_work_mode: preferredWorkMode,
  expected_salary: expectedSalary,
            

          }),
        })

        const data = await response.json()

        if (!response.ok) {
    if (typeof data === 'object' && data !== null) {
      const firstError = Object.values(data).flat()[0]

      setSaveError(
        firstError || 'Failed to update profile.'
      )
    } else {
      setSaveError('Failed to update profile.')
    }

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

      if (applications.length === 1 && applicationPage > 1) {
        setApplicationPage((currentPage) => currentPage - 1)
      } else {
        await loadApplications(accessToken)
      }
    } catch (error) {
      setApplicationError('Unable to connect to the server.')
    }
  }
  const handleResumeDelete = async (resume) => {
  const confirmed = window.confirm(
    `Remove "${resume.name}" from your resume library?`
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/resumes/${resume.id}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      setResumeError('Unable to remove this resume.')
      return
    }

    setResumes((currentResumes) =>
      currentResumes.filter(
        (currentResume) => currentResume.id !== resume.id
      )
    )
  } catch (error) {
    setResumeError('Unable to connect to the server.')
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

      setResumes([])
      setResumeError('')
      setResumeFormError('')
      setSelectedResumeFile(null)
      setResumeName('')
      setResumeVersion(1)

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
                <span>Career Workspace</span>
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
                  activeSection === 'resumes' ? 'active' : ''
                }`}
                onClick={() => setActiveSection('resumes')}
              >
                <span className="nav-icon">▤</span>
                Resumes
              </button>
              <button
  className={`nav-item ${
    activeSection === 'interviews' ? 'active' : ''
  }`}
  onClick={() => setActiveSection('interviews')}
>
  <span className="nav-icon">◈</span>
  Interview Rounds
</button>
  <button
            className={`nav-item ${
              activeSection === 'oa-deadlines' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('oa-deadlines')}
          >
            <span className="nav-icon">◷</span>
            OA Deadlines
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
      : activeSection === 'resumes'
        ? 'Resumes'
        : activeSection === 'interviews'
      ? 'Interview Rounds'
      : activeSection === 'oa-deadlines'
        ? 'OA Deadlines'
        : 'Your Profile'}
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
  {activeSection === 'oa-deadlines' && (
<button
   className="primary-action"
   onClick={openCreateOaDeadline}
 >
<span>+</span>
Add OA Deadline
</button>
)}
            </header>

            {activeSection === 'companies' && (
              <section className="dashboard-content">
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-icon">▦</div>

                    <div>
                      <span>Total Companies</span>
                      <strong>{companies.length}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon purple">✓</div>

                    <div>
                      <span>Tracked Workspace</span>
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
                      <span>Total Applications</span>
                      <strong>{applications.length}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon purple">▦</div>

                    <div>
                      <span>Companies Targeted</span>
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
                    <h2>Your Applications</h2>
                    <p>
                      Track and manage the jobs you're applying to.
                    </p>
                  </div>
                </div>
          <div className="application-toolbar">
    <div className="application-search">
      <span className="application-search-icon">⌕</span>

      <input
        type="text"
        placeholder="Search by position or company..."
        value={applicationSearch}
        onChange={(e) => {
    setApplicationSearch(e.target.value)
    setApplicationPage(1)
  }}
        
      />
    </div>

    <div className="application-filter">
      <select
        value={applicationStatusFilter}
        onChange={(e) => {
    const value = e.target.value
    setApplicationStatusFilter(value)
  setApplicationPage(1)
  }}
      >
        <option value="">All statuses</option>
        <option value="applied">Applied</option>
        <option value="oa">OA</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

  <div className="application-filter">
    <select
      value={applicationCompanyFilter}
      onChange={(e) => {
    const value = e.target.value
    setApplicationCompanyFilter(value)
    setApplicationPage(1)
  }}
    >
      <option value="">All companies</option>

      {companies.map((company) => (
        <option
          key={company.id}
          value={company.name}
        >
          {company.name}
        </option>
      ))}
        </select>
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
    {company?.website ? (
      <img
        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
          company.website
        )}&sz=128`}
        alt={`${companyName} logo`}
      />
    ) : (
      companyName.charAt(0).toUpperCase()
    )}
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
                                {status === 'oa'
        ? 'OA'
        : status.charAt(0).toUpperCase() + status.slice(1)}
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
    {[...(statusHistory[application.id] || [])].reverse().map((entry) => (
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
                            {status === 'oa'
                            ? 'OA'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
                              {applicationTotalPages > 1 && (
                  <div className="application-pagination">
                    <button
                      type="button"
                      onClick={() =>
                        setApplicationPage((currentPage) => currentPage - 1)
                      }
                      disabled={applicationPage === 1}
                    >
                      ← Previous
                    </button>

                    <span>
                      Page {applicationPage} of {applicationTotalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setApplicationPage((currentPage) => currentPage + 1)
                      }
                      disabled={applicationPage === applicationTotalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </section>
            )}


           {activeSection === 'resumes' && (
  <section className="dashboard-content">
    <div className="section-heading">
      <div>
        <h2>Your Resumes</h2>
        <p>
          Manage your resume versions and keep your application
          materials ready.
        </p>
      </div>
    </div>
     <form className="resume-upload-card" onSubmit={handleResumeUpload}>
      <div className="resume-upload-header">
        <div>
          <h3>Upload a Resume</h3>
          <p>Add a new version to your resume library.</p>
        </div>
      </div>

      <div className="resume-upload-grid">
        <div className="form-group">
          <label>Resume Name</label>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g. Software Engineer Resume"
          />
        </div>

        <div className="form-group">
          <label>Version</label>
          <input
            type="number"
            min="1"
            value={resumeVersion}
            onChange={(e) => setResumeVersion(Number(e.target.value))}
          />
        </div>

        <div className="form-group resume-file-field">
          <label>Resume File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setSelectedResumeFile(e.target.files[0] || null)
            }
          />
        </div>
      </div>

      {resumeFormError && (
        <div className="form-error">
          {resumeFormError}
        </div>
      )}

      <button
        type="submit"
        className="primary-action"
        disabled={isUploadingResume}
      >
        {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
      </button>
    </form>

    {resumes.length === 0 ? (
  <div className="empty-state">
    <div className="empty-icon">▤</div>
    <h3>No resumes yet</h3>
    <p>
      Upload your first resume to start building your resume
      library.
    </p>
  </div>
) : (
  <div className="resume-list">
    {resumes.map((resume) => (
      <div className="resume-card" key={resume.id}>
  <div className="resume-card-main">
    <div className="resume-file-icon">
      📄
    </div>

    <div className="resume-card-info">
      <div className="resume-card-title-row">
        <h3>{resume.name}</h3>
        <span className="resume-version-badge">
          v{resume.version}
        </span>
      </div>

      <p className="resume-file-name">
        {resume.file
          ? resume.file.split('/').pop()
          : 'Resume document'}
      </p>

      <p className="resume-file-meta">
        Ready to use for your applications
      </p>
    </div>
  </div>

  <div className="resume-card-actions">
    <button
      type="button"
      className="resume-view-button"
      onClick={() => window.open(resume.file, '_blank')}
      disabled={!resume.file}
    >
      Download Resume
    </button>

    <button
      type="button"
      className="resume-secondary-button"
      onClick={() => {
        navigator.clipboard.writeText(resume.file)
      }}
      disabled={!resume.file}
    >
      Copy Link
    </button>
    <button
      type="button"
      className="resume-delete-button"
      onClick={() => handleResumeDelete(resume)}
    >
      Remove
    </button>
  </div>
</div>
    ))}
  </div>
)}
  </section>
)}


{activeSection === 'interviews' && (
  <section className="dashboard-content interview-page">
    <div className="interview-hero">
      <div>
        <p className="eyebrow">INTERVIEW MANAGEMENT</p>
        <h2>Your Interview Rounds</h2>
        <p>
          Prepare for every stage, organize your feedback, and keep
          your interview journey on track.
        </p>
      </div>

      <div className="interview-hero-icon">◈</div>
    </div>

    <div className="interview-stats">
      <div className="interview-stat-card">
        <span>Total rounds</span>
        <strong>{interviewRounds.length}</strong>
      </div>
      <div className="interview-stat-card">
        <span>Scheduled</span>
        <strong>
          {interviewRounds.filter((round) => round.status === 'scheduled').length}
        </strong>
      </div>
      <div className="interview-stat-card">
        <span>Completed</span>
        <strong>
          {interviewRounds.filter((round) => round.status === 'completed').length}
        </strong>
      </div>
    </div>

    <div className="interview-panel">
      <div className="interview-panel-heading">
        <div>
          <h3>{editingInterviewRound ? 'Edit interview round' : 'Add an interview round'}</h3>
          <p>Link a round to one of your existing job applications.</p>
        </div>
      </div>

      <form className="interview-form" onSubmit={handleInterviewRoundSubmit}>
        <div className="interview-form-grid">
          <div className="form-group">
            <label htmlFor="interview-application">Job application *</label>
            <select
              id="interview-application"
              value={selectedInterviewApplication}
              onChange={(event) => setSelectedInterviewApplication(event.target.value)}
              required
            >
              <option value="">Select an application</option>
              {applications.map((application) => {
                const companyId =
                  typeof application.company === 'object'
                    ? application.company?.id
                    : application.company

                const companyName =
                  application.company?.name ||
                  companies.find((company) => String(company.id) === String(companyId))?.name ||
                  'Company'

                return (
                  <option key={application.id} value={application.id}>
                    {application.position || application.job_title || 'Job'} — {companyName}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interview-round-number">Round number *</label>
            <input
              id="interview-round-number"
              type="number"
              min="1"
              value={interviewRoundNumber}
              onChange={(event) => setInterviewRoundNumber(Number(event.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="interview-round-type">Round type *</label>
            <select
              id="interview-round-type"
              value={interviewRoundType}
              onChange={(event) => setInterviewRoundType(event.target.value)}
              required
            >
              <option value="technical">Technical</option>
              <option value="system_design">System Design</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR</option>
              <option value="managerial">Managerial</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interview-round-status">Status *</label>
            <select
              id="interview-round-status"
              value={interviewRoundStatus}
              onChange={(event) => setInterviewRoundStatus(event.target.value)}
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interview-scheduled-at">Date and time</label>
            <input
              id="interview-scheduled-at"
              type="datetime-local"
              value={interviewRoundScheduledAt}
              onChange={(event) => setInterviewRoundScheduledAt(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interview-interviewer">Interviewer</label>
            <input
              id="interview-interviewer"
              type="text"
              maxLength="150"
              value={interviewRoundInterviewer}
              onChange={(event) => setInterviewRoundInterviewer(event.target.value)}
              placeholder="Interviewer name"
            />
          </div>

          <div className="form-group interview-full-width">
            <label htmlFor="interview-notes">Preparation notes</label>
            <textarea
              id="interview-notes"
              rows="3"
              value={interviewRoundNotes}
              onChange={(event) => setInterviewRoundNotes(event.target.value)}
              placeholder="Topics to revise, questions to prepare..."
            />
          </div>

          <div className="form-group interview-full-width">
            <label htmlFor="interview-feedback">Feedback and outcome</label>
            <textarea
              id="interview-feedback"
              rows="3"
              value={interviewRoundFeedback}
              onChange={(event) => setInterviewRoundFeedback(event.target.value)}
              placeholder="Record feedback, questions asked, and next steps..."
            />
          </div>
        </div>

        {interviewRoundFormError && (
          <div className="form-error">{interviewRoundFormError}</div>
        )}

        {applications.length === 0 && (
          <p className="interview-form-hint">
            Add a job application first to link an interview round to it.
          </p>
        )}

        <div className="interview-form-actions">
          {editingInterviewRound && (
            <button
              type="button"
              className="secondary-action"
              onClick={resetInterviewRoundForm}
              disabled={isSavingInterviewRound}
            >
              Cancel edit
            </button>
          )}

          <button
            type="submit"
            className="primary-action"
            disabled={isSavingInterviewRound || applications.length === 0}
          >
            {isSavingInterviewRound
              ? 'Saving...'
              : editingInterviewRound
                ? 'Save changes'
                : '+ Add interview round'}
          </button>
        </div>
      </form>
    </div>

    <div className="interview-list-heading">
      <div>
        <h3>Round history</h3>
        <p>Your interview stages across all applications.</p>
      </div>
      <span>{interviewRounds.length} rounds</span>
    </div>

    {interviewRoundError && (
      <div className="alert error-alert">
        <strong>Unable to load rounds</strong>
        <span>{interviewRoundError}</span>
        <button onClick={() => loadInterviewRounds(accessToken)}>Try again</button>
      </div>
    )}

    {isLoadingInterviewRounds ? (
      <div className="interview-empty-state">Loading your interview rounds...</div>
    ) : interviewRounds.length === 0 ? (
      <div className="interview-empty-state">
        <div className="interview-empty-icon">◈</div>
        <h3>Your interview journey starts here</h3>
        <p>
          Add your first interview round above to track schedules, preparation
          notes, and feedback in one place.
        </p>
      </div>
    ) : (
      <div className="interview-round-list">
        {interviewRounds.map((round) => {
          const linkedApplication = applications.find(
            (application) => String(application.id) === String(round.application)
          )

          const companyId =
            typeof linkedApplication?.company === 'object'
              ? linkedApplication.company?.id
              : linkedApplication?.company

          const companyName =
            linkedApplication?.company?.name ||
            companies.find((company) => String(company.id) === String(companyId))?.name ||
            'Company'

          return (
            <article className="interview-round-card" key={round.id}>
              <div className="interview-round-number">
                <span>ROUND</span>
                <strong>{round.round_number}</strong>
              </div>

              <div className="interview-round-details">
                <div className="interview-round-title-row">
                  <h4>
                    {(round.round_type || 'other')
                      .replaceAll('_', ' ')
                      .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </h4>
                  <span className={`interview-status-badge ${round.status}`}>
                    {round.status}
                  </span>
                </div>

                <p className="interview-round-role">
                  {linkedApplication?.position || linkedApplication?.job_title || 'Job application'} · {companyName}
                </p>

                <div className="interview-round-meta">
                  {round.scheduled_at && (
                    <span>
                      ◷ {new Date(round.scheduled_at).toLocaleString()}
                    </span>
                  )}
                  {round.interviewer && <span>◎ {round.interviewer}</span>}
                </div>

                {round.notes && (
                  <div className="interview-detail-note">
                    <strong>Preparation notes</strong>
                    <p>{round.notes}</p>
                  </div>
                )}

                {round.feedback && (
                  <div className="interview-detail-note">
                    <strong>Feedback</strong>
                    <p>{round.feedback}</p>
                  </div>
                )}
              </div>

              <div className="interview-round-actions">
  <button
    type="button"
    className="secondary-action"
    onClick={() => openEditInterviewRound(round)}
  >
    Edit
  </button>

  <button
    type="button"
    className="secondary-action"
    onClick={() => handleInterviewRoundDelete(round)}
  >
    Delete
  </button>
</div>
            </article>
          )
        })}
      </div>
    )}
  </section>
)}
{activeSection === 'oa-deadlines' && (
  <section className="dashboard-content oa-page">
    <div className="oa-hero">
      <div>
        <p className="eyebrow">ASSESSMENT TRACKER</p>
        <h2>Your OA Deadlines</h2>
        <p>
          Keep online assessments organized, track upcoming deadlines,
          and stay ahead of every opportunity.
        </p>
      </div>
      <div className="oa-hero-icon">◷</div>
    </div>

    <div className="oa-stats">
      <div className="oa-stat-card">
        <span>Total assessments</span>
        <strong>{oaDeadlines.length}</strong>
      </div>
      <div className="oa-stat-card">
        <span>Pending</span>
        <strong>
          {oaDeadlines.filter((item) => item.status === 'pending').length}
        </strong>
      </div>
      <div className="oa-stat-card">
        <span>Completed</span>
        <strong>
          {oaDeadlines.filter((item) => item.status === 'completed').length}
        </strong>
      </div>
    </div>

    <div className="oa-panel">
  <div className="interview-panel-heading">
    <div>
      <h3>{editingOaDeadline ? 'Edit OA Deadline' : 'Add an Assessment'}</h3>
      <p>Keep track of online assessments and never miss a deadline.</p>
    </div>
  </div>

  <form onSubmit={handleOaDeadlineSubmit} className="interview-form">
    <div className="interview-form-grid">
      <div className="form-group">
        <label>Assessment Title *</label>
        <input
          type="text"
          value={oaDeadlineTitle}
          onChange={(e) => setOaDeadlineTitle(e.target.value)}
          placeholder="e.g. Amazon Online Assessment"
          required
        />
      </div>

      <div className="form-group">
        <label>Job Application *</label>
        <select
          value={oaDeadlineApplication}
          onChange={(e) => setOaDeadlineApplication(e.target.value)}
          required
        >
          <option value="">Select an application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.company_name ||
                application.company?.name ||
                'Company'}{' '}
              — {application.position}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Deadline *</label>
        <input
          type="datetime-local"
          value={oaDeadlineAt}
          onChange={(e) => setOaDeadlineAt(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          value={oaDeadlineStatus}
          onChange={(e) => setOaDeadlineStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Assessment URL</label>
        <input
          type="url"
          value={oaDeadlineUrl}
          onChange={(e) => setOaDeadlineUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={oaDeadlineNotes}
          onChange={(e) => setOaDeadlineNotes(e.target.value)}
          placeholder="Instructions, topics to prepare, or other notes"
          rows={3}
        />
      </div>
    </div>

    {oaDeadlineFormError && (
      <p className="form-error">{oaDeadlineFormError}</p>
    )}

    <div className="interview-form-actions">
      <button type="submit" disabled={isSavingOaDeadline}>
        {isSavingOaDeadline
          ? 'Saving...'
          : editingOaDeadline
            ? 'Update Deadline'
            : 'Add Deadline'}
      </button>

      {editingOaDeadline && (
        <button
          type="button"
          onClick={resetOaDeadlineForm}
          disabled={isSavingOaDeadline}
        >
          Cancel
        </button>
      )}
    </div>
  </form>
</div>

<div className="oa-panel">
  <div className="interview-panel-heading">
    <div>
      <h3>Assessment Deadlines</h3>
      <p>Manage your upcoming and completed online assessments.</p>
    </div>
    <span className="oa-deadline-count">
      {oaDeadlines.length} total
    </span>
  </div>

  {isLoadingOaDeadlines ? (
    <p>Loading assessment deadlines...</p>
  ) : oaDeadlineError ? (
    <div className="oa-empty-state">
      <p>{oaDeadlineError}</p>
      <button
        type="button"
        onClick={() => loadOaDeadlines(accessToken)}
      >
        Try Again
      </button>
    </div>
  ) : oaDeadlines.length === 0 ? (
    <div className="oa-empty-state">
      <div className="oa-empty-icon">◷</div>
      <h4>No assessment deadlines yet</h4>
      <p>
        Add your first online assessment using the form above.
      </p>
    </div>
  ) : (
    <div className="oa-deadline-list">
      {oaDeadlines.map((deadline) => (
        <article className="oa-deadline-card" key={deadline.id}>
          <div className="oa-deadline-card-top">
            <div>
              <h4>{deadline.title}</h4>
              <p className="oa-deadline-company">
                {deadline.application_details?.company_name ||
                  deadline.application?.company_name ||
                  deadline.application?.company?.name ||
                  'Job application'}
              </p>
            </div>

            <span
              className={`oa-deadline-status status-${deadline.status}`}
            >
              {deadline.status.replace('_', ' ')}
            </span>
          </div>

          <div className="oa-deadline-grid">
            <div>
              <span className="oa-detail-label">Deadline</span>
              <p className="oa-deadline-date">
                {new Date(deadline.deadline_at).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {deadline.assessment_url && (
              <div>
                <span className="oa-detail-label">Assessment link</span>
                <a
                  href={deadline.assessment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open assessment ↗
                </a>
              </div>
            )}
          </div>

          {deadline.notes && (
            <p className="oa-deadline-notes">{deadline.notes}</p>
          )}

          <div className="oa-deadline-actions">
            <button
              type="button"
              onClick={() => openEditOaDeadline(deadline)}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleOaDeadlineDelete(deadline)}
              className="oa-delete-button"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )}
</div>
  </section>
)}

{activeSection === 'profile' && (
  <section className="profile-content">

      <div className="profile-hero">
    <div className="profile-avatar-large">
      {profile.user?.charAt(0).toUpperCase()}
    </div>

    <div className="profile-hero-info">
      <div className="profile-hero-top">
        <p className="eyebrow">Your account</p>

        {openToWork && (
          <span className="profile-status-badge">
            ● Open to work
          </span>
        )}
      </div>

      <h2>{profile.user}</h2>

      <p className="profile-headline">
        {headline || 'Add a professional headline to your profile.'}
      </p>

      <div className="profile-meta">
        {location && <span>📍 {location}</span>}
        {university && <span>🎓 {university}</span>}
      </div>
    </div>
  </div>

      <div className="profile-settings-card">
        <div className="settings-heading">
          <h3>Basic Information</h3>
          <p>Tell recruiters and employers more about you.</p>
        </div>

        <div className="profile-fields">

          <div className="form-group">
            <label>Username</label>
            <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
          </div>

          <div className="form-group">
            <label>Headline</label>
            <input
              type="text"
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Computer Science Student"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
    <div className="phone-input-wrapper">
    <span className="phone-prefix">+91</span>
    <input
      type="tel"
      id="phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
      placeholder="9876543210"
      maxLength="10"
    />
  </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you based?"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself"
              rows="4"
            />
          </div>

        </div>
      </div>

      <div className="profile-settings-card">
        <div className="settings-heading">
          <h3>Education</h3>
          <p>Add your academic background.</p>
        </div>

        <div className="profile-fields">

          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
            />
          </div>

          <div className="form-group">
            <label>Degree</label>
            <input
              type="text"
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.Tech Computer Science"
            />
          </div>

          <div className="form-group">
            <label>Graduation Year</label>
            <input
              type="number"
              id="graduation_year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="e.g. 2027"
              min="2020"
    max="2035"
            />
          </div>

        </div>
      </div>

      <div className="profile-settings-card">
        <div className="settings-heading">
          <h3>Professional Links</h3>
          <p>Connect your professional profiles.</p>
        </div>

        <div className="profile-fields">

          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              id="github_url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              id="linkedin_url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="form-group">
            <label>Portfolio</label>
            <input
              type="url"
              id="portfolio_url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

        </div>
      </div>

      <div className="profile-settings-card">
        <div className="settings-heading">
          <h3>Job Preferences</h3>
          <p>
            Tell OfferPipeline what kind of opportunities you're looking for.
          </p>
        </div>

        <div className="profile-fields">

          <div className="form-group">
            <label>Preferred Roles</label>
            <textarea
            id="preferred_roles"
              value={preferredRoles}
              onChange={(e) => setPreferredRoles(e.target.value)}
              placeholder="e.g. Backend Developer, Software Engineer"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Preferred Locations</label>
            <textarea
            id="preferred_locations"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
              placeholder="e.g. Delhi NCR, Bangalore, Remote"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Preferred Work Mode</label>
            <input
              type="text"
              id="preferred_work_mode"
              value={preferredWorkMode}
              onChange={(e) => setPreferredWorkMode(e.target.value)}
              placeholder="e.g. Remote, Hybrid, On-site"
            />
          </div>

          <div className="form-group">
            <label>Expected Salary</label>
            <input
              type="number"
              id="expected_salary"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              placeholder="Expected annual salary"
                min="50000"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={openToWork}
                onChange={(e) => setOpenToWork(e.target.checked)}
              />
              Open to work
            </label>
          </div>

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
          {isSavingProfile ? 'Saving...' : 'Save Changes'}
        </button>
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
      {isRegistering ? 'GET STARTED' : 'SIGN IN TO YOUR WORKSPACE'}
    </span>

    <h1>
      {isRegistering
        ? 'Create your account'
        : 'Welcome Back'}
    </h1>
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
    className="auth-switch-button"
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
    className="auth-switch-button"
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
export default App;