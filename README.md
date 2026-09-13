# OfferPipeline

### AI-Powered Internship & Job Application Management Platform

OfferPipeline is a full-stack web application designed to help students and job seekers manage the complete internship and job application lifecycle from a single platform.

The project is being developed incrementally as a production-oriented SaaS application, with a strong focus on backend engineering, REST API design, authentication, authorization, database architecture, asynchronous processing, AI integration, and production deployment.

The long-term goal is to evolve OfferPipeline beyond a traditional CRUD application into an AI-powered career management platform.

---

## 🎯 The Problem

Job searching quickly becomes difficult to manage when applications are spread across spreadsheets, notes, calendars, emails, resumes, and different documents.

OfferPipeline aims to bring the entire process into one platform.

Users will eventually be able to:

- Track companies and job applications
- Store application details and statuses
- Manage multiple resume versions
- Track interviews and deadlines
- Store notes and feedback
- Analyze application statistics
- Analyze resumes and job descriptions with AI
- Generate personalized career-related content
- Receive automated reminders
- Use personalized AI assistance powered by RAG

---

# 🚀 Current Features

## 👤 Authentication & User Management

- User registration
- User login
- JWT-based authentication
- Authenticated session restoration
- User profile management
- Protected API endpoints
- Object-level authorization
- User-specific data isolation

---

## 🏢 Company Management

Users can manage the companies they are interested in applying to.

### Supported operations

- Create companies
- View companies
- Update companies
- Delete companies

### Security

Company data is protected using object-level permissions.

Users can only access and modify companies that belong to them.

---

## 📄 Application Management

Users can track individual job and internship applications associated with their companies.

### Supported operations

- Create applications
- View applications
- Update applications
- Delete applications
- Associate applications with existing companies
- Track application position
- Track application status
- Track applied date
- Store application notes

The Application system is integrated with the existing Company system and protected through authenticated API access and ownership-based authorization.

---

## 🖥️ Frontend

OfferPipeline includes a React-based frontend connected to the Django REST API.

Current frontend functionality includes:

- Authentication flow
- User profile management
- Company management interface
- Application management interface
- Application creation
- Application editing
- Application deletion
- Form validation
- Application status selection
- Application date validation
- Application notes with character counter
- Responsive modal-based CRUD interfaces
- Backend API integration

---

# 🛠️ Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication

## Database

- PostgreSQL

## Frontend

- React
- JavaScript
- CSS
- HTML
- Vite

## Development & Tools

- Git
- GitHub
- REST APIs
- Environment Variables
- Virtual Environment

---

# 🏗️ Architecture

OfferPipeline follows a client-server architecture.

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Django REST Framework
      │
      ├── Authentication
      ├── Authorization
      ├── Business Logic
      ├── Object-Level Permissions
      └── API Endpoints
      │
      ▼
PostgreSQL