# OfferPipeline Frontend

React frontend for **OfferPipeline** — a job and internship application management platform.

The frontend provides the user-facing interface for authentication, profile management, company management, application tracking, resume management, interview tracking, online assessment deadlines, application notes, tags, search, filtering, pagination, and application status history.

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

Users can manage the companies associated with their job and internship applications.

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

Users can manage their job and internship applications.

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

### ⏰ Online Assessment (OA) Deadlines

Users can manage online assessment deadlines associated with their job and internship applications.

- Create OA deadlines
- View OA deadlines
- Edit OA deadlines
- Delete OA deadlines
- Associate deadlines with applications
- Set assessment date and time
- Add assessment URLs
- Manage deadline status
- Add notes
- Form validation
- Loading and error states

Supported deadline statuses:

- Pending
- In Progress
- Completed
- Missed

---

### 📝 Application Notes

Users can maintain notes related to their job and internship applications.

- Create application notes
- View saved notes
- Edit existing notes
- Delete notes
- Associate notes with applications
- Display the related application
- View saved note content
- Notes list and card interface
- Loading and error handling

Application Notes help users keep track of follow-ups, recruiter conversations, application details, and other important information.

---

### 🏷️ Tags

Users can organize and categorize their applications using customizable tags.

- Create tags
- View saved tags
- Edit tag names
- Delete tags
- Select tag colours
- Associate tags with applications
- Display associated application information
- Visual tag indicators
- Tag cards and management controls

Tags provide a visual way to categorize applications, such as priority applications, dream companies, or applications requiring follow-up.

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
- OA Deadlines interface
- Application Notes interface
- Tags management interface
- Colour-coded tag indicators
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
- OA deadline management
- Application note management
- Tag management

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

Run the following command from the frontend directory:

```bash
npm install
```

### 2. Start the React development server

```bash
npm run dev
```

Vite starts the frontend development server, usually at:

```text
http://localhost:5173/
```

### 3. Start the Django backend

Run the following command from the backend project directory containing `manage.py`:

```bash
python manage.py runserver
```

Ensure that the local PostgreSQL database is configured, the required migrations are applied, and the backend is running.

The backend host and CORS settings must permit requests from the local frontend.

### 4. API environment configuration

The frontend currently selects its API base URL according to the Vite environment:

- Development: `http://127.0.0.1:8000/api`
- Production: `https://offerpipeline-production.up.railway.app/api`

This allows the local frontend to communicate with the local Django backend while the production frontend uses the deployed API.

If the API configuration changes, update the relevant frontend configuration before running or deploying the application.

---

## 🌐 Production

The production architecture uses the deployed React frontend, Django REST API, and production PostgreSQL database.

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

Local development and production use separate database environments.

**Running migrations locally does not apply those migrations to the production database.** Production migrations must be applied separately to the production database.

For a more configurable production setup, environment-specific Vite variables such as `VITE_API_BASE_URL` can be used to configure the API URL without hard-coding it in the source.

---

## 📈 Current MVP Status

| Feature | Status |
|---|---|
| Authentication | ✅ Implemented |
| Profile Management | ✅ Implemented |
| Company CRUD | ✅ Implemented |
| Application CRUD | ✅ Implemented |
| Application Status Timeline | ✅ Implemented |
| Application Search | ✅ Implemented |
| Application Filtering | ✅ Implemented |
| Application Pagination | ✅ Implemented |
| Resume Management | ✅ Implemented |
| Interview Rounds | ✅ Implemented |
| OA Deadlines | ✅ Implemented |
| Application Notes | ✅ Implemented |
| Tags | ✅ Implemented |
| Responsive UI | ✅ Implemented |
| Backend Automated Tests | ✅ 32 tests passing in the latest reported run |
| Frontend Production Build | ✅ Successful in the latest reported run |
| Analytics Dashboard | 🚧 Planned |
| Production Deployment Verification | 🚧 Ongoing |

The test and build results above reflect the latest reported local verification. Run the checks again after subsequent code changes.

Production deployment and end-to-end production verification must be confirmed separately from local testing.

---

## 🧪 Testing

### Frontend production build

Run the following command from the frontend directory:

```bash
npm run build
```

This checks whether Vite can build the frontend for production.

### Backend automated tests

Run the following command from the backend project directory containing `manage.py`:

```bash
python manage.py test
```

This runs the Django test suite.

### Database migration status

To check migration status for the companies application:

```bash
python manage.py showmigrations companies
```

A migration marked with `[X]` has been applied to the database being checked.

Remember that local and production databases have separate migration states.

### Integration testing

Before a production release, verify:

- Authentication and session restoration
- Company and application CRUD operations
- Search, filtering, and pagination
- Application status history
- Resume upload, download, and removal
- Interview round CRUD operations
- OA deadline CRUD operations
- Application note creation, editing, and deletion
- Tag creation, editing, deletion, and colour display
- Application associations for notes and tags
- Local and production API connectivity
- Production database migrations
- Error handling and ownership permissions
- Frontend production build
- Existing pages after UI or CSS changes

---

## 🛣️ Future Frontend Development

Potential future enhancements include:

- Analytics Dashboard for application statistics and insights
- Application reminders and notifications
- AI-powered resume analysis
- Job description analysis
- Personalized AI assistance
- Career analytics
- AI-powered job recommendations

These enhancements may be introduced in future versions as the platform evolves.

---

## 🔮 Future Scope

OfferPipeline aims to evolve into an AI-powered job and internship application management platform.

The long-term vision includes application insights, automated reminders, resume analysis, job description analysis, personalized career assistance, and intelligent job recommendations.