# OfferPipeline

### AI-Powered Internship & Job Application Management Platform

OfferPipeline is a full-stack web application designed to help students and job seekers manage the complete internship and job application lifecycle from a single platform.

The project is being developed incrementally as a production-oriented SaaS application, with a strong focus on backend engineering, REST API design, authentication, authorization, database architecture, and production deployment.

The long-term goal is to evolve OfferPipeline beyond a traditional CRUD application into an AI-powered career management platform.

---

## 🎯 The Problem

Job searching quickly becomes difficult to manage when applications are spread across spreadsheets, notes, calendars, emails, resumes, and different documents.

OfferPipeline aims to bring the entire process into one platform.

Users will eventually be able to:

- Track companies and job applications
- Store application details and statuses
- Track complete application status history
- Manage multiple resume versions
- Track interviews and deadlines
- Store notes and feedback
- Analyze application statistics
- Analyze resumes and job descriptions with AI
- Generate personalized career-related content
- Receive automated reminders
- Use personalized AI assistance powered by RAG

---

# 🚀 Current MVP Features

## 👤 Authentication & User Management

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

Company data is protected using object-level permissions.

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
- Track applied date
- Store application notes

### Validation

- Application date validation
- Form validation
- Loading and error states
- Application notes character counter

The Application system is integrated with the existing Company system and protected through authenticated API access and ownership-based authorization.

---

## 📊 Application Status Timeline

OfferPipeline maintains a persistent history of application status changes.

Instead of only storing the current application status, every status transition is recorded as a separate history entry.

### Supported Functionality

- Automatically create an initial status-history entry when an application is created
- Track application status transitions
- Preserve previous application statuses
- Store the timestamp of each status change
- Retrieve status history through a dedicated REST API
- Display complete application history
- Display status history chronologically
- Display status-specific timeline indicators
- Expand and collapse application timelines
- Maintain separate history for each application
- Handle loading, empty, and error states
- Responsive timeline interface

### Example Application Lifecycle

```text
Applied
   ↓
OA
   ↓
Interview
   ↓
Offer
```

---

## 🔎 Search, Filtering & Pagination

The application management system includes server-side search, filtering, ordering, and pagination.

### Search

Users can search applications by:

- Position
- Company name

### Filters

Applications can be filtered by:

- Application status
- Company

### Pagination

- Page-number pagination
- 10 applications per page
- Previous/Next navigation
- Search, filtering, and pagination work together
- Applications are ordered by creation date

### Frontend Search

- Debounced search input
- Search results update automatically
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

Profile updates are protected through authenticated API access.

---

# 🧪 API Testing

The backend includes automated API tests covering the core application functionality.

The current test suite includes coverage for:

- Application APIs
- Search
- Filtering
- Pagination
- Authentication-related API behavior
- Ownership and authorization behavior

The latest test run completed successfully:

```text
Ran 11 tests
OK
```

---

# 🗄️ Database

OfferPipeline uses PostgreSQL as its relational database.

The backend uses Django migrations for database schema management.

Core data models include:

- User
- Profile
- Company
- Application
- ApplicationStatusHistory

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

---

# 🏗️ Project Structure

```text
OfferPipeline/
│
├── backend/
│   ├── manage.py
│   ├── users/
│   ├── companies/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

> The exact directory structure may evolve as the project grows.

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

Production secrets and environment-specific configuration are not stored in the public repository.

---

# 🚀 Running the Backend Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd OfferPipeline
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file containing the required Django and PostgreSQL configuration.

### 5. Apply migrations

```bash
python manage.py migrate
```

### 6. Start the development server

```bash
python manage.py runserver
```

---

# 🌐 Frontend

The React frontend is located inside the `frontend/` directory.

For frontend-specific documentation, see:

```text
frontend/README.md
```

---

# 📈 Current MVP Status

| Feature | Status |
|---|---|
| JWT Authentication | ✅ Complete |
| User Profile | ✅ Complete |
| Object-Level Permissions | ✅ Complete |
| Company CRUD | ✅ Complete |
| Application CRUD | ✅ Complete |
| Application Status Timeline | ✅ Complete |
| Search | ✅ Complete |
| Filtering | ✅ Complete |
| Pagination | ✅ Complete |
| API Tests | ✅ Complete |
| PostgreSQL Integration | ✅ Complete |
| Production Deployment | 🚧 In Progress |

---

# 🛣️ Future Roadmap

The current version focuses on establishing a solid full-stack foundation.

Planned future development includes:

- Resume management
- Multiple resume versions
- Interview tracking
- Application deadlines
- Notes and feedback management
- Application analytics
- Automated reminders
- AI-powered resume analysis
- Job description analysis
- Personalized career content generation
- LLM integration
- Retrieval-Augmented Generation (RAG)
- Asynchronous processing with Celery
- Redis-based background processing
- Advanced AI career assistance

These features are part of the long-term roadmap and are not part of the current MVP.

---

# 🎯 Project Vision

OfferPipeline is being developed as more than a basic CRUD application.

The goal is to build a production-oriented career management platform that combines:

```text
Application Management
        +
Career Data
        +
Automation
        +
AI
        +
Personalized Assistance
```

The MVP establishes the foundation for that larger system.