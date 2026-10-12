# OfferPipeline

### AI-Powered Internship & Job Application Management Platform

OfferPipeline is a full-stack web application designed to help students and job seekers manage their internship and job application lifecycle from a single platform.

The project is being developed incrementally as a production-oriented SaaS application, with a strong focus on backend engineering, REST API design, authentication, authorization, database architecture, and production deployment.

The long-term goal is to evolve OfferPipeline beyond a traditional CRUD application into an AI-powered career management platform.

---

## 🎯 The Problem

Job searching quickly becomes difficult to manage when applications are spread across spreadsheets, notes, calendars, emails, resumes, and different documents.

OfferPipeline aims to bring the entire process into one platform.

Users can manage their companies and applications, maintain application status history, organize resumes, and track interview rounds.

Future versions aim to provide application analytics, automated reminders, AI-powered resume analysis, job description analysis, and personalized career assistance.

---

# 🚀 Current MVP Features

## 🔐 Authentication & User Management

- User registration
- User login
- JWT-based authentication
- JWT token refresh
- Authenticated session restoration
- User profile management
- Username editing
- Protected API endpoints
- Object-level authorization
- User-specific data isolation
- Authentication error handling

---

## 🏢 Company Management

Users can manage the companies they are interested in applying to.

### Supported Operations

- Create companies
- View companies
- Update companies
- Delete companies

### Company Information

- Company name
- Company website
- Company location
- Company notes
- Company favicon/logo display

### Security

Company data is protected through authenticated API access and ownership-based authorization.

Users can only access and modify companies that belong to them.

---

## 📄 Application Management

Users can track individual job and internship applications associated with their companies.

### Supported Operations

- Create applications
- View applications
- Update applications
- Delete applications
- Associate applications with existing companies
- Track application position
- Track application status
- Track application date
- Store application notes

### Validation & User Experience

- Application date validation
- Form validation
- Loading and error states
- Application notes character counter

The application management system integrates with the Company system and uses authenticated API access and ownership-based authorization.

---

## 📊 Application Status Timeline

OfferPipeline maintains a persistent history of application status changes.

Instead of only storing the current application status, status transitions are recorded as separate history entries.

### Supported Functionality

- Automatically create an initial status-history entry when an application is created
- Track application status transitions
- Preserve previous application statuses
- Store timestamps for status changes
- Retrieve status history through the REST API
- Display application history chronologically
- Display status-specific timeline indicators
- Expand and collapse application timelines
- Maintain separate history for each application
- Handle loading, empty, and error states
- Responsive timeline interface

### Example Application Lifecycle

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

## 🔎 Search, Filtering & Pagination

The application management system includes server-side search, filtering, and pagination.

### Search

Users can search applications by:

- Position
- Company name

### Filters

Applications can be filtered by:

- Application status
- Company name

### Pagination

- Page-number pagination
- 10 applications per page
- Previous and Next navigation
- Disabled pagination states
- Search, filtering, and pagination work together
- Applications ordered by creation date

### Frontend Search

- Debounced search input
- Automatic search without requiring the Enter key
- Loading and error states
- Pagination controls

---

## 👤 User Profile

Users can manage their professional profile information.

### Profile Information

- Username
- Bio
- Location
- Phone number
- Professional headline
- University
- Degree
- Graduation year
- GitHub URL
- LinkedIn URL
- Portfolio URL
- Open-to-work status
- Preferred roles
- Preferred locations
- Preferred work mode
- Expected salary

Profile updates use authenticated API access.

---

## 📑 Resume Management

OfferPipeline includes backend and frontend work for managing resumes through a resume library.

### Supported Functionality

- Upload resumes
- View uploaded resumes
- Associate resumes with their owners
- Manage resume versions
- Download resumes
- Copy resume links
- Delete resumes
- Resume removal confirmation
- Resume upload validation
- Loading, empty, and error states

Resume records are stored in the database, and uploaded files are managed through Django's file-handling functionality.

Production file-storage configuration and end-to-end deployment behavior should be verified separately.

---

## 🎯 Interview Rounds

OfferPipeline includes an interview-round management feature for tracking interviews associated with job and internship applications.

### Supported Functionality

- Create interview rounds
- View interview rounds
- Update interview rounds
- Delete interview rounds
- Associate rounds with applications
- Track round numbers
- Categorize interview types
- Manage interview statuses
- Schedule interview dates and times
- Record interviewer information
- Store interview notes
- Store interview feedback
- Enforce ownership-based access
- Handle loading, empty, and error states

### Supported Interview Types

- Technical
- System Design
- Behavioral
- HR
- Managerial
- Other

### Interview Statuses

- Scheduled
- Completed
- Cancelled

The Interview Rounds backend, database migration, serializer, API viewset, routing, and automated backend tests have been implemented. Frontend integration has been developed, with complete end-to-end and production API verification remaining.

---

# 🧪 API Testing

The backend includes automated API tests covering core application functionality.

The test suite includes coverage for:

- Application APIs
- Company APIs
- Search
- Filtering
- Pagination
- Authentication-related API behavior
- Ownership and authorization behavior
- Additional core backend functionality

### Latest Confirmed Test Result

```text
Ran 19 tests
OK
```

The latest reported backend test run completed successfully.

Automated test results confirm the tested backend behavior. They do not, by themselves, establish that every frontend workflow or production deployment scenario has been verified.

---

# 🗄️ Database

OfferPipeline uses PostgreSQL as its relational database.

Django migrations are used to manage database schema changes.

### Core Data Models

- User
- Profile
- Company
- Application
- ApplicationStatusHistory
- Resume
- InterviewRound

The models support user profiles, company information, application tracking, status history, resume management, and interview-round tracking.

---

# 🛠️ Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- django-environ

## Frontend

- React
- JavaScript
- Vite
- CSS

## Development & Deployment

- Git
- GitHub
- PostgreSQL
- Railway
- Gunicorn

---

# 🏗️ Project Structure

The project uses a Django backend at the repository root and a separate React frontend directory.

```text
OfferPipeline/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── users/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── ...
│
├── companies/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py
│   └── migrations/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

The exact structure may evolve as the project grows.

---

# 🔐 Security

OfferPipeline follows an authenticated, ownership-based access model.

The backend implements:

- JWT authentication
- Protected API endpoints
- Object-level permissions
- Owner-scoped querysets
- User-specific data isolation
- Environment-based configuration for sensitive values

Sensitive production secrets should be stored in environment variables and must not be committed to the public repository.

---

# 🚀 Running the Backend Locally

## 1. Clone the repository

```bash
git clone https://github.com/ishanttttt1/OfferPipeline.git
cd OfferPipeline
```

## 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure environment variables

Create a local `.env` file containing the required Django and PostgreSQL configuration.

Use your own local database credentials and a secure Django secret key. Do not commit `.env` or production secrets to GitHub.

## 5. Apply migrations

```bash
python manage.py migrate
```

## 6. Run backend tests

```bash
python manage.py test companies
```

## 7. Start the development server

```bash
python manage.py runserver
```

The Django API will usually be available at:

```text
http://127.0.0.1:8000/
```

Ensure PostgreSQL is running and the environment variables are configured before starting the server.

---

# 🌐 Frontend

The React frontend is located inside the `frontend/` directory.

For frontend-specific setup, features, and development instructions, see:

```text
frontend/README.md
```

### Start the frontend locally

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will usually be available at:

```text
http://localhost:5173/
```

The frontend API configuration must point to the intended backend environment.

---

# 🌐 Production Deployment

OfferPipeline uses Railway for its production hosting setup.

### Production Architecture

```text
User
 ↓
React Frontend
 ↓
Django REST API
 ↓
PostgreSQL Database
```

The frontend communicates with the deployed Django REST API, which accesses the production PostgreSQL database.

### Production Considerations

- Configure environment variables in the hosting platform
- Keep production secrets outside the repository
- Configure allowed hosts and CORS appropriately
- Use the production database configuration
- Run database migrations during deployment
- Configure Gunicorn for serving Django
- Verify authentication and API permissions
- Verify resume file storage and downloads
- Test production API endpoints
- Verify frontend and backend integration after deployment

**Deployment status: In progress.** Production verification of the Interview Rounds feature and related end-to-end workflows remains part of the deployment checklist.

---

# 📈 Current MVP Status

| Feature | Status |
|---|---|
| JWT Authentication | ✅ Implemented |
| User Profile | ✅ Implemented |
| Object-Level Permissions | ✅ Implemented |
| Company CRUD | ✅ Implemented |
| Application CRUD | ✅ Implemented |
| Application Status Timeline | ✅ Implemented |
| Search | ✅ Implemented |
| Filtering | ✅ Implemented |
| Pagination | ✅ Implemented |
| PostgreSQL Integration | ✅ Implemented |
| Resume Management | ✅ Backend and frontend implemented |
| Interview Rounds Backend | ✅ Implemented and tested |
| Interview Rounds Frontend | 🚧 Integration and production verification |
| Automated Backend Tests | ✅ 19 tests passed in the latest reported run |
| Production Deployment | 🚧 In progress |

---

# 🛣️ Future Roadmap

The current version focuses on establishing a solid full-stack foundation.

Planned future development includes:

### Career Management

- Application deadlines and reminders
- Application analytics and dashboards
- Career progress tracking
- Advanced notes and feedback management

### AI-Powered Features

- AI-powered resume analysis
- Job description analysis
- Resume-to-job matching
- Personalized career content generation
- AI-powered recommendations
- Personalized AI career assistance

### Infrastructure & Scalability

- Large language model (LLM) integration
- Retrieval-Augmented Generation (RAG)
- Asynchronous processing with Celery
- Redis-based background processing
- Improved deployment and monitoring
- Expanded automated testing

These enhancements will build on the existing application-management foundation.

---

# 🎯 Project Vision

OfferPipeline is being developed as more than a basic CRUD application.

The goal is to build a production-oriented career management platform that combines:

```text
Application Management
        +
Career Data
        +
Resume Management
        +
Interview Tracking
        +
Automation
        +
Artificial Intelligence
        +
Personalized Assistance
```

The current MVP establishes the foundation for that larger system, with further development focused on reliability, scalability, production readiness, and AI-powered career support.
