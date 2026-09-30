# OfferPipeline Frontend

React frontend for OfferPipeline — a job and internship application management platform.

The frontend provides the user-facing interface for authentication, profile management, company management, application tracking, search, filtering, pagination, and application status history.

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

Applications can be efficiently organized using server-side search, filtering, and pagination.

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

The frontend displays the complete status history of each application.

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
OA
   ↓
Interview
   ↓
Offer
```

---

## 🎨 UI & UX

The frontend uses a SaaS-style dashboard interface designed for a clean application-management experience.

- Responsive dashboard layout
- SaaS-style UI
- Authentication screen styling
- Profile interface
- Company management interface
- Application cards
- Application search toolbar
- Status and company filters
- Responsive pagination controls
- Modal-based forms
- Responsive forms
- Loading states
- Success states
- Error states
- Form validation feedback
- Polished profile interface

---

# 🛠️ Tech Stack

- React
- JavaScript
- CSS
- Vite

---

# 🔗 API Integration

The frontend communicates with the OfferPipeline Django REST API for:

- User registration
- Authentication
- JWT token management
- User profiles
- Company management
- Application management
- Application search
- Application filtering
- Application pagination
- Application status history

The frontend and backend communicate through REST API endpoints.

---

# 📁 Project Structure

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

> The exact structure may evolve as the application grows.

---

# 🚀 Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The Vite development server will start the frontend locally.

The frontend communicates with the local Django backend during development.

---

# 🌐 Production

For production deployment, the frontend will communicate with the deployed OfferPipeline Django REST API instead of the local development server.

```text
Development

React
  ↓
Local Django API
  ↓
Local PostgreSQL
```

```text
Production

React
  ↓
Deployed Django API
  ↓
Production PostgreSQL
```

Production API configuration is environment-specific and should not contain hard-coded development URLs.

---

# 📈 Current MVP Status

| Feature | Status |
|---|---|
| Authentication | ✅ Complete |
| Profile Management | ✅ Complete |
| Company CRUD | ✅ Complete |
| Application CRUD | ✅ Complete |
| Status Timeline | ✅ Complete |
| Search | ✅ Complete |
| Filtering | ✅ Complete |
| Pagination | ✅ Complete |
| Responsive UI | ✅ Complete |
| Production Deployment | 🚧 In Progress |

---

# 🛣️ Future Frontend Development

Future versions of the frontend may include interfaces for:

- Resume management
- Interview tracking
- Application analytics
- Application reminders
- AI-powered resume analysis
- Job description analysis
- Personalized AI assistance
- Career analytics
- AI-powered recommendations

These features are part of the future roadmap and are not included in the current MVP.