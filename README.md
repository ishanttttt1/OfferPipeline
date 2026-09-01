# OfferPipeline

### AI-Powered Internship & Job Application Management Platform

OfferPipeline is a production-oriented web application for managing the complete job application lifecycle — from tracking companies and applications to managing resumes, interviews, deadlines, and eventually AI-powered career assistance.

The project is being developed incrementally as a real SaaS-style product, with a strong focus on backend engineering, API design, authentication, authorization, database architecture, asynchronous processing, and AI integration.

---

## 🎯 The Problem

Job searching quickly becomes difficult to manage when applications are spread across spreadsheets, notes, calendars, emails, and multiple documents.

OfferPipeline aims to bring the entire process into one platform.

Users will eventually be able to:

- Track companies and job applications
- Store application details and statuses
- Manage multiple resume versions
- Track interviews and deadlines
- Store notes and feedback
- Analyze application statistics
- Use AI to analyze resumes and job descriptions
- Generate personalized career-related content

---

## 🚀 Current Features

### 👤 Authentication & User Management

- JWT-based authentication
- User registration and login
- Authenticated session restoration
- User profile management
- Protected API endpoints
- Object-level authorization

### 🏢 Company Management

- Create companies
- View companies
- Update companies
- Delete companies
- Company ownership
- Object-level permission enforcement
- Users cannot access or modify companies owned by other users

### 🖥️ Frontend

- React frontend
- Authentication flow
- Profile management
- Company management interface
- Integration with Django REST APIs

---

## 🛠️ Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

### Database
- PostgreSQL

### Frontend
- React
- JavaScript
- CSS
- HTML

### Development & Tools
- Git
- GitHub
- Environment Variables
- REST APIs

---

## 🏗️ Architecture

OfferPipeline follows a client-server architecture:

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Django REST Framework
      │
      ├── Authentication & Authorization
      ├── Business Logic
      ├── Object-Level Permissions
      └── API Endpoints
      │
      ▼
PostgreSQL