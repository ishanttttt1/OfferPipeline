# OfferPipeline — Frontend

A modern, colourful SaaS-style frontend for **OfferPipeline**, an AI-powered job and internship application management platform. The application helps users organize job applications, manage interviews and assessment deadlines, track progress, and monitor their job search through an analytics dashboard.

## Overview

The OfferPipeline frontend provides an interactive workspace for managing the complete job application lifecycle.

### Key Features

- **Authentication** — User registration, login, JWT-based authentication, and session restoration.
- **Analytics Dashboard** — View application statistics, offers, interview completion rate, response rate, and online assessment completion rate.
- **Company Management** — Create, view, update, and delete company records.
- **Application Management** — Manage job and internship applications, update application statuses, and organize application records.
- **Application Timeline** — Track application status history and review application progress.
- **Resume Management** — Manage resume records and associated resume files.
- **Interview Rounds** — Track interview rounds, interview types, schedules, interviewers, notes, and feedback.
- **Online Assessment Deadlines** — Manage online assessment deadlines, links, completion status, and notes.
- **Application Notes** — Add, edit, and manage notes associated with applications.
- **Tags** — Organize applications using customizable tags and colours.
- **Search, Filtering, and Pagination** — Navigate and organize application data where supported by the backend.
- **Profile Management** — View and manage user profile information.
- **Responsive UI** — A clean, colourful SaaS-inspired interface designed for a consistent workspace experience.

## Technology Stack

- **React** — Component-based user interface.
- **Vite** — Frontend development server and production build tool.
- **JavaScript (ES Modules)** — Application logic.
- **CSS** — Custom styling and responsive layouts.
- **Django REST Framework API** — Backend communication.
- **JWT Authentication** — Authenticated API requests and session management.

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── ...
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Prerequisites

Install the following before running the frontend:

- Node.js
- npm
- The OfferPipeline Django backend

Verify your installation:

```bash
node --version
npm --version
```

## Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

## Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in your browser.

The frontend uses the local Django API during development:

```text
http://127.0.0.1:8000/api
```

Make sure the Django backend is running and its database is configured.

## API Configuration

The API base URL is configured in the frontend using Vite's environment mode.

Development:

```javascript
const API_BASE_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000/api'
  : 'https://offerpipeline-production.up.railway.app/api';
```

In development mode, requests use the local Django backend.

In production mode, requests use the configured Railway backend.

**Important:** The production API URL must match the deployed backend service. Authentication, CORS, database connectivity, and backend availability must also be configured correctly for production requests to succeed.

## Analytics Dashboard

The Analytics Dashboard provides a summary of a user's job search progress.

### Displayed Metrics

| Metric | Description |
|---|---|
| Total Applications | Total number of applications represented by the backend analytics response. |
| Applications Submitted | Number of applications counted as submitted by the backend's status definitions. |
| Offers | Number of applications counted as offers by the backend's status definitions. |
| Interview Completion Rate | Percentage calculated using the backend's interview completion logic. |
| Response Rate | Percentage calculated using the backend's response-rate logic. |
| OA Completion Rate | Percentage calculated using the backend's online assessment completion logic. |

### Dashboard Behaviour

- Retrieves analytics data from the Django REST API.
- Displays statistic cards using a responsive grid.
- Shows a loading state while analytics data is being retrieved.
- Displays an error message when the analytics request fails.
- Handles unavailable analytics data with an appropriate empty state.
- Refreshes the displayed statistics when the dashboard reloads and fetches updated data.

The dashboard requests analytics through the API route:

```text
GET /api/companies/analytics/
```

The endpoint is registered through the companies API router. The final URL depends on the backend's root URL configuration.

## Production Build

Generate an optimized production build:

```bash
npm run build
```

Vite generates the production assets in:

```text
frontend/dist/
```

Preview the production build locally:

```bash
npm run preview
```

Use the URL printed by Vite to open the preview in your browser.

## Testing and Verification

### Frontend Build

```bash
npm run build
```

A successful build confirms that Vite can compile the frontend for production.

### Backend Tests

Run the Django test suite from the backend project directory, where `manage.py` is located:

```bash
python manage.py test
```

The Analytics Dashboard development checkpoint recorded **36 passing backend tests**. Run the suite again after subsequent changes to verify the current state.

### Manual Verification

Before deployment, verify that:

- The user can log in and restore an authenticated session.
- The Analytics Dashboard loads successfully.
- All six statistics display correctly.
- Statistics reflect changes to application data after refreshing.
- Loading, error, and empty states behave as expected.
- Existing application-management features continue to work.
- The production frontend can communicate with the deployed backend.

## Deployment

The frontend is developed with Vite and can be deployed using a compatible static hosting service or the project's configured deployment platform.

Before deploying:

1. Install dependencies.
2. Run the production build.
3. Confirm the production API URL is correct.
4. Ensure the backend is deployed and reachable.
5. Verify CORS and authentication configuration.
6. Test the deployed application and its API requests.

The generated `dist/` directory contains the optimized frontend assets.

## Development Workflow

Recommended workflow for frontend changes:

1. Start the Django backend.
2. Start the Vite development server.
3. Implement and test the change locally.
4. Run `npm run build`.
5. Run the backend test suite when backend functionality is affected.
6. Review changes using Git.
7. Commit and push verified changes.
8. Confirm deployment and test the production application.

## Future Improvements

Potential enhancements include:

- Visual application-status breakdowns and charts.
- More detailed job-search progress summaries.
- Additional analytics and productivity insights.
- Improved accessibility and responsive behaviour.
- Further automation for job application tracking.

## Project

**OfferPipeline** — An AI-powered platform for organizing job applications, resumes, interviews, assessment deadlines, and job-search progress.