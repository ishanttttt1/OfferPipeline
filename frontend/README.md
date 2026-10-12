# OfferPipeline Frontend

React frontend for **OfferPipeline** — a job and internship application management platform.

The frontend provides the user-facing interface for authentication, profile management, company management, application tracking, resume management, interview tracking, search, filtering, pagination, and application status history.

---

## 🚀 Current MVP Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- JWT token storage
- Authenticated session restoration
- Logout
- Protected dashboard
- Authentication error handling

---

### 👤 Profile Management

- User profile management
- Username display and editing
- Bio management
- Location management
- Phone number management
- Professional headline
- University and degree information
- Graduation year
- GitHub URL
- LinkedIn URL
- Portfolio URL
- Open-to-work status
- Preferred roles
- Preferred locations
- Preferred work mode
- Expected salary
- Profile form validation
- Profile loading and error states

---

### 🏢 Company Management

Users can manage the companies associated with their applications.

- Create companies
- View companies
- Edit companies
- Delete companies
- Company website information
- Company location information
- Company notes
- Company favicon/logo display
- Form validation
- Loading and error states

---

### 📄 Application Management

Users can manage internship and job applications.

- Create applications
- View applications
- Edit applications
- Delete applications
- Associate applications with companies
- Application position
- Application status
- Application date
- Application notes
- Application date validation
- Form validation
- Application notes character counter
- Loading and error states

---

### 🔎 Application Search, Filtering & Pagination

Applications can be organized using server-side search, filtering, and pagination.

#### Search

- Search applications by position
- Search applications by company name
- Debounced search input
- Automatic search without requiring the Enter key

#### Filters

- Filter by application status
- Filter by company

#### Pagination

- Page-number pagination
- 10 applications per page
- Previous and Next controls
- Disabled pagination states
- Search, filters, and pagination work together

---

### 📊 Application Status Timeline

The frontend displays the status history of each application.

- View application status history
- Track status changes over time
- Chronological status timeline
- Status-specific visual indicators
- Expand and collapse application timelines
- Loading states
- Empty states
- Error handling

Example:

```text
Applied
   ↓
Online Assessment
   ↓
Interview
   ↓
Offer
```

---

### 📑 Resume Management

Users can manage their resumes through the resume library.

- Upload resumes
- View uploaded resumes
- Manage resume versions
- Download resumes
- Copy resume links
- Remove resumes
- Resume removal confirmation
- Resume upload validation
- Loading and error states

---

### 🎯 Interview Rounds

Users can track interview rounds associated with their job and internship applications.

- Create interview rounds
- View interview rounds
- Edit interview rounds
- Delete interview rounds
- Associate rounds with applications
- Round number and interview type
- Interview status management
- Schedule interview dates and times
- Record interviewer details
- Add interview notes
- Store interview feedback
- Form validation
- Loading and error states
- Empty-state interface

Supported interview types include technical, system design, behavioral, HR, managerial, and other rounds.

Interview statuses include scheduled, completed, and cancelled.

---

## 🎨 UI & UX

The frontend uses a SaaS-style dashboard interface designed for a clean application-management experience.

- Responsive dashboard layout
- SaaS-style interface
- Authentication screen styling
- Profile management interface
- Company management interface
- Application cards
- Application search toolbar
- Status and company filters
- Responsive pagination controls
- Modal-based forms
- Responsive forms
- Interview Rounds interface
- Resume management interface
- Loading states
- Success states
- Error states
- Form validation feedback
- Empty states

---

## 🛠️ Tech Stack

- React
- JavaScript
- CSS
- Vite

---

## 🔗 API Integration

The frontend communicates with the OfferPipeline Django REST API for:

- User registration and authentication
- JWT token management
- User profile management
- Company management
- Application management
- Application search
- Application filtering
- Application pagination
- Application status history
- Resume uploads and management
- Interview round management

The frontend and backend communicate through REST API endpoints.

---

## 📁 Project Structure

```text
frontend/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── ...
│
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

The exact project structure may evolve as the application grows.

---

## 🚀 Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the React development server

```bash
npm run dev
```

Vite starts the frontend development server, usually at `http://localhost:5173`.

### 3. Start the Django backend

Run the Django development server from the backend project directory:

```bash
python manage.py runserver
```

Ensure that the frontend API configuration points to the intended backend environment and that the backend's host and CORS settings permit local development requests.

---

## 🌐 Production

In production, the frontend communicates with the deployed OfferPipeline Django REST API.

### Development architecture

```text
React Frontend
      ↓
Local Django REST API
      ↓
Local PostgreSQL Database
```

### Production architecture

```text
React Frontend
      ↓
Deployed Django REST API
      ↓
Production PostgreSQL Database
```

Production and development API configuration should be kept separate. Production deployments should use the deployed API URL, while local development should use the local Django API.

For a production-ready setup, environment-specific configuration should be used instead of relying on hard-coded development URLs.

---

## 📈 Current MVP Status

| Feature | Status |
|---|---|
| Authentication | ✅ Implemented |
| Profile Management | ✅ Implemented |
| Company CRUD | ✅ Implemented |
| Application CRUD | ✅ Implemented |
| Application Status Timeline | ✅ Implemented |
| Search | ✅ Implemented |
| Filtering | ✅ Implemented |
| Pagination | ✅ Implemented |
| Resume Management | ✅ Implemented |
| Interview Rounds | 🚧 Frontend integration and production verification |
| Responsive UI | ✅ Implemented |
| Production Deployment | 🚧 In progress |

---

## 🛣️ Future Frontend Development

Potential future enhancements include:

- Application analytics and visual dashboards
- Application reminders and notifications
- AI-powered resume analysis
- Job description analysis
- Personalized AI assistance
- Career analytics
- AI-powered job recommendations

These enhancements may be introduced in future versions as the platform evolves.

---

## 🧪 Testing

The frontend production build can be checked using:

```bash
npm run build
```

Backend API tests can be run from the backend project directory:

```bash
python manage.py test companies
```

Production API integration and end-to-end user workflows should also be verified before marking a feature fully production-ready.
