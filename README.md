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

## 📊 Application Status Timeline

OfferPipeline maintains a persistent history of application status changes.

Instead of only storing the current application status, every status transition is recorded as a separate history entry.

### Supported functionality

- Automatically create an initial status-history entry when an application is created
- Track application status transitions
- Preserve previous application statuses
- Store the timestamp of each status change
- Retrieve status history through a dedicated REST API
- Display complete application history
- Display status history chronologically
- Display status-specific timeline indicators
- Expand and collapse application timelines
- Persist status history in PostgreSQL
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