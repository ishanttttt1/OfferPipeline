# OfferPipeline Frontend

React frontend for OfferPipeline — a job and internship application management platform.

## Current Features

### Authentication
- User registration and login
- JWT-based authentication
- Session restoration
- Logout
- Protected dashboard

### Profile
- User profile management
- Username display
- Bio and location management
- Profile update functionality

### Company Management
- Create companies
- View companies
- Edit companies
- Delete companies
- Company website and location information
- Company logo/favicon display

### Application Management
- Create applications
- View applications
- Edit applications
- Delete applications
- Application status tracking
- Application date validation
- Application notes with character counter
- Form validation

### Application Search & Organization
- Search applications by position or company
- Filter applications by status
- Filter applications by company
- Pagination with 10 applications per page
- Search, filters, and pagination work together
- Debounced application search
- Pagination state persists across page refreshes

### Application Status Timeline
- View application status history
- Track status changes over time
- Chronological status timeline
- Status-specific visual indicators

### UI & UX
- SaaS-style dashboard interface
- Responsive layout
- Responsive modal-based forms
- Polished application cards
- Responsive pagination controls
- Authentication screen styling
- Profile and dashboard interfaces
- Loading, success, and error states

## Tech Stack

- React
- JavaScript
- CSS
- Vite

## API Integration

The frontend communicates with the OfferPipeline Django REST API for:

- Authentication
- User profiles
- Company management
- Application management
- Application search and filtering
- Application pagination
- Application status history

## Development

Start the frontend development server:

```bash
npm run dev