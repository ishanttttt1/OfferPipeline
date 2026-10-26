OfferPipeline
AI-Powered Internship & Job Application Management Platform
OfferPipeline is a full-stack web application designed to help students and job seekers manage their internship and job application lifecycle from a single platform.

The project is being developed incrementally as a production-oriented SaaS application, focusing on backend engineering, REST API design, authentication, authorization, database architecture, and deployment.

The long-term goal is to evolve OfferPipeline beyond a traditional CRUD application into an AI-powered career management platform.
🎯 The Problem
Managing job and internship applications across spreadsheets, notes, calendars, emails, resumes, and documents can become difficult.

OfferPipeline brings these workflows together in one platform.

Users can manage companies and applications, maintain application status history, organize resumes, track interview rounds, manage online assessment deadlines, write application notes, and categorize applications using tags.

Future versions aim to introduce automated reminders, AI-powered resume analysis, job description analysis, and personalized career assistance.
🚀 Current MVP Features
🔐 Authentication & User Management
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
🏢 Company Management
Users can manage companies they are interested in applying to.
Supported Operations
- Create companies
- View companies
- Update companies
- Delete companies
Company Information
- Company name
- Company website
- Company location
- Company notes
- Company favicon/logo display
Company data is protected through authenticated API access and ownership-based authorization.
📄 Application Management
Users can track individual job and internship applications associated with their companies.
Supported Operations
- Create applications
- View applications
- Update applications
- Delete applications
- Associate applications with companies
- Track application positions
- Track application statuses
- Track application dates
- Store application notes
Validation & User Experience
- Application date validation
- Form validation
- Loading and error states
- Application notes character counter
📊 Application Status Timeline
OfferPipeline maintains a persistent history of application status changes.
Supported Functionality
- Automatically record initial application status history
- Track application status transitions
- Preserve previous application statuses
- Store timestamps for status changes
- Retrieve status history through the REST API
- Display application history chronologically
- Status-specific timeline indicators
- Expand and collapse application timelines
- Maintain separate history for each application
- Loading, empty, and error states
Example Application Lifecycle

Applied

   ↓

Online Assessment

   ↓

Interview

   ↓

Offer

🔎 Search, Filtering & Pagination
The application management system includes server-side search, filtering, and pagination.
Search
Users can search applications by:
- Position
- Company name
Filters
- Application status
- Company name
Pagination
- Page-number pagination
- 10 applications per page
- Previous and Next navigation
- Disabled pagination states
- Search, filtering, and pagination work together
- Applications ordered by creation date
The frontend includes debounced search and automatic updates without requiring the Enter key.
👤 User Profile
Users can manage their professional profile information.
Profile Information
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
📑 Resume Management
OfferPipeline includes backend and frontend functionality for managing resumes through a resume library.
Supported Functionality
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

Production file-storage configuration and end-to-end deployment behavior must be verified separately.
🎯 Interview Rounds
Users can track interview rounds associated with their job and internship applications.
Supported Functionality
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
- Loading, empty, and error states
Supported Interview Types
- Technical
- System Design
- Behavioral
- HR
- Managerial
- Other
Interview Statuses
- Scheduled
- Completed
- Cancelled
The backend model, serializer, API viewset, routing, database migration, and automated tests have been implemented.

The deployed Interview Rounds workflow was previously verified on Railway after applying its pending database migration.
⏰ Online Assessment (OA) Deadlines
Users can track online assessments associated with their job and internship applications.
Supported Functionality
- Create OA deadlines
- View OA deadlines
- Update OA deadlines
- Delete OA deadlines
- Associate deadlines with applications
- Set assessment dates and times
- Store assessment URLs
- Add notes
- Manage deadline statuses
- Enforce ownership-based access
- Loading, empty, and error states
Supported Statuses
- Pending
- In Progress
- Completed
- Missed
The backend model, serializer, API viewset, routing, database migration, and automated API tests have been implemented.

The frontend workflow has been tested locally. Production database migration and end-to-end production verification must be confirmed separately.
📝 Application Notes
Application Notes allow users to maintain additional information about their job and internship applications.
Supported Functionality
- Create application notes
- View saved notes
- Update existing notes
- Delete notes
- Associate notes with applications
- Retrieve saved note content
- Display associated application information
- Handle loading and error states
Notes can be used to record recruiter conversations, follow-up reminders, application updates, and other important information.
🏷️ Tags
Tags help users categorize and organize their applications visually.
Supported Functionality
- Create tags
- View saved tags
- Update tag names
- Delete tags
- Select tag colours
- Associate tags with applications
- Display associated application information
- Visual tag indicators
- Tag management interface
Tags can be used to categorize applications, such as priority applications, dream companies, and applications requiring follow-up.
📊 Analytics Dashboard
The Analytics Dashboard provides users with an overview of their job and internship application progress.
Supported Functionality
- Retrieve application statistics through the REST API
- Track total applications
- Track submitted applications
- Track offers received
- Calculate interview completion rate
- Calculate application response rate
- Calculate online assessment completion rate
- Provide authenticated, user-specific analytics
API Endpoint:

GET /api/companies/analytics/

The endpoint uses the application's authentication and authorization configuration to provide analytics for the authenticated user.
🗄️ Database Architecture
OfferPipeline uses PostgreSQL as its relational database.

Django migrations manage database schema changes.
Core Data Models
**Users application**
- User
- Profile
**Companies application**
- Company
- Application
- ApplicationStatusHistory
- Resume
- InterviewRound
- OADeadline
- ApplicationNote
- Tag
The models support user profiles, company information, application tracking, status history, resume management, interview scheduling, assessment deadlines, notes, and application categorization.
Database Migrations
The companies application currently includes these migrations:

| Migration | Purpose |

|---|---|

| 0001_initial | Initial company-related schema |

| 0002_application | Application model |

| 0003_applicationstatushistory | Application status history |

| 0004_resume | Resume management |

| 0005_interviewround | Interview rounds |

| 0006_oadeadline | Online assessment deadlines |

| 0007_applicationnote_tag | Application notes and tags |

Migration names describe the corresponding schema changes.

Local and production databases have separate migration states. Running migrations locally does not automatically update the production database.
🛠️ Tech Stack
Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- django-environ
Frontend
- React
- JavaScript
- Vite
- CSS
Development & Deployment
- Git
- GitHub
- PostgreSQL
- Railway
- Gunicorn
🏗️ Project Structure
The project uses a Django backend at the repository root and a separate React frontend directory.

OfferPipeline/

│

├── config/

│   ├── \_\_init\_\_.py

│   ├── asgi.py

│   ├── settings.py

│   ├── urls.py

│   └── wsgi.py

│

├── users/

│   ├── migrations/

│   ├── \_\_init\_\_.py

│   ├── admin.py

│   ├── apps.py

│   ├── models.py

│   ├── permissions.py

│   ├── serializers.py

│   ├── signals.py

│   ├── tests.py

│   ├── urls.py

│   └── views.py

│

├── companies/

│   ├── migrations/

│   ├── \_\_init\_\_.py

│   ├── admin.py

│   ├── apps.py

│   ├── models.py

│   ├── serializers.py

│   ├── tests.py

│   ├── urls.py

│   └── views.py

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── index.css

│   │   └── main.jsx

│   ├── package.json

│   ├── package-lock.json

│   ├── vite.config.js

│   └── README.md

│

├── media/

├── resumes/

├── manage.py

├── requirements.txt

├── .env

├── .gitignore

└── README.md

This is a simplified representation of the project structure. Additional files and directories may exist.
🔐 Security
OfferPipeline follows an authenticated, ownership-based access model.

The backend implements:
- JWT authentication
- Protected API endpoints
- Object-level permissions
- Owner-scoped querysets
- User-specific data isolation
- Application ownership validation
- Environment-based configuration for sensitive values
Sensitive production secrets must be stored in environment variables and must not be committed to the repository.
🚀 Running the Backend Locally
1. Clone the repository

git clone https://github.com/ishanttttt1/OfferPipeline.git

cd OfferPipeline

2. Create a virtual environment

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

3. Install dependencies

pip install -r requirements.txt

4. Configure environment variables
Create a local .env file containing the required Django and PostgreSQL configuration.

Use your own database credentials and a secure Django secret key.

**Never commit .env or production secrets to GitHub.**
5. Apply database migrations

python manage.py migrate

This applies pending migrations to the database configured for the current environment.
6. Run backend tests
Run the complete Django test suite:

python manage.py test

Alternatively, to run tests for the companies application:

python manage.py test companies

7. Start the development server

python manage.py runserver

The Django development server will usually be available at:

http://127.0.0.1:8000/

Ensure PostgreSQL is running and environment variables are configured before starting the server.
🌐 Frontend
The React frontend is located inside the frontend/ directory.

For frontend-specific setup, features, and development instructions, see frontend/README.md.
Start the frontend locally

cd frontend

npm install

npm run dev

The Vite development server will usually be available at:

http://localhost:5173/

The frontend API configuration currently selects the local Django API during Vite development and the deployed Railway API for production builds.
🧪 Testing
Backend Tests
Run from the project root:

python manage.py test

The latest reported local test run completed successfully:

Ran 36 tests

OK

The test suite includes coverage for core API functionality, authentication-related behavior, authorization, application-management features, and analytics.

The result above reflects the latest reported run. Run the tests again after further code changes.
Frontend Production Build
Run from the frontend directory:

npm run build

The latest reported production build completed successfully using Vite.
Migration Status
To check migrations for the companies application:

python manage.py showmigrations companies

A migration marked [X] has been applied to the database being checked.
Integration Testing
Before a release, verify:
- Registration, login, and session restoration
- User profile operations
- Company CRUD operations
- Application CRUD operations
- Search, filtering, and pagination
- Application status history
- Resume upload, download, and deletion
- Interview round CRUD operations
- OA deadline CRUD operations
- Application Notes creation, editing, and deletion
- Tag creation, editing, deletion, and colour display
- Application associations for notes and tags
- Ownership permissions and user-specific data isolation
- Local API connectivity
- Production database migrations
- Frontend production build
- Production API connectivity and deployment behavior
Automated backend tests and a successful frontend build do not, by themselves, guarantee that every production workflow has been verified.
🌐 Production Deployment
OfferPipeline uses Railway for its production hosting setup.
Production Architecture

User

  ↓

React Frontend

  ↓

Django REST API

  ↓

PostgreSQL Database

Production Considerations
- Configure environment variables in the hosting platform
- Keep production secrets outside the repository
- Configure allowed hosts and CORS appropriately
- Use the production database configuration
- Apply pending database migrations in the production environment
- Configure Gunicorn for serving Django
- Verify authentication and API permissions
- Verify resume file storage and downloads
- Test production API endpoints
- Verify frontend and backend integration after deployment
- Test ownership permissions and user-specific data isolation
Deployment Status
The frontend and backend have been deployed on Railway.

Interview Rounds was verified on the deployed application after its pending database migration was applied.

OA Deadlines, Application Notes, Tags, and the Analytics Dashboard have been implemented and tested locally as documented in the current development progress. Production migrations and end-to-end production verification must be confirmed separately before declaring all workflows production-ready.
📈 Current MVP Status
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

| Resume Management | ✅ Implemented |

| Interview Rounds | ✅ Implemented |

| OA Deadlines | ✅ Implemented and locally tested |

| Application Notes | ✅ Implemented and locally tested |

| Tags | ✅ Implemented and locally tested |

| Automated Backend Tests | ✅ 36 tests passed in the latest reported run |

| Frontend Production Build | ✅ Successful in the latest reported run |

| Analytics Dashboard | ✅ Backend and frontend implemented locally |

| Production Verification | 🚧 Ongoing |
🛣️ Future Roadmap
Career Management
- Application statistics and insights
- Automated deadline reminders and notifications
- Career progress tracking
- Enhanced notes and feedback management
AI-Powered Features
- AI-powered resume analysis
- Job description analysis
- Resume-to-job matching
- Personalized career content generation
- AI-powered recommendations
- Personalized AI career assistance
Infrastructure & Scalability
- Large language model integration
- Retrieval-Augmented Generation (RAG)
- Asynchronous processing with Celery
- Redis-based background processing
- Improved deployment and monitoring
- Expanded automated testing
These enhancements will build on the existing application-management foundation.
🎯 Project Vision
OfferPipeline is being developed as more than a basic CRUD application.

The goal is to build a production-oriented career management platform that combines:

Application Management

        +

Career Data

        +

Resume Management

        +

Interview Tracking

        +

Assessment Deadline Tracking

        +

Application Notes & Tags

        +

Automation

        +

Artificial Intelligence

        +

Personalized Assistance

The current MVP establishes the foundation for that larger system, with further development focused on reliability, scalability, production readiness, analytics, and AI-powered career support.