# IMS Admin Features Documentation

## Overview

The IMS (Inventory Management System) Travel Application now includes a complete admin panel with full CRUD (Create, Read, Update, Delete) operations for managing packages, destinations, users, bookings, payments, and reviews.

## Admin Authentication

### Admin Credentials
- **Email:** harry@gmail.com
- **Password:** harry@1234

### Admin Access
- Admins can login via the regular login page
- After login, the navbar will show an "Admin" button instead of "Dashboard" and "My Bookings"
- Click the "Admin" button to access the admin dashboard

## Admin Dashboard

The Admin Dashboard (`/admin/dashboard`) is the main entry point for all admin operations. It displays 6 management cards:

1. **Manage Packages** - Create, view, and delete travel packages
2. **Manage Destinations** - Create, view, and delete travel destinations
3. **Manage Users** - Create users and manage their roles
4. **Manage Bookings** - View and manage customer bookings
5. **Manage Payments** - Track and manage payment transactions
6. **Manage Reviews** - Monitor customer reviews and ratings

## Admin Features

### 1. Package Management

#### View All Packages
- **Route:** `/admin/packages`
- **Features:**
  - Display all packages in a table format
  - Shows Package ID, Title, Destination, Duration, Base Price, and Max People
  - Delete packages with confirmation dialog
  - Link to create new packages

#### Create New Package
- **Route:** `/admin/packages/create`
- **Form Fields:**
  - Package Title (required)
  - Destination (dropdown, populated from database)
  - Duration in Days (required)
  - Base Price (required)
  - Max People (required)
  - Description (required)
  - Image URL (optional)
- **Validation:** All required fields must be filled before submission
- **API Integration:** Sends POST request to `/packages` endpoint
- **Success:** Redirects to package management page after 2 seconds

### 2. Destination Management

#### View All Destinations
- **Route:** `/admin/destinations`
- **Features:**
  - Display all destinations in a table format
  - Shows Destination ID, Name, Country, and Description
  - Delete destinations with confirmation dialog
  - Link to create new destinations

#### Create New Destination
- **Route:** `/admin/destinations/create`
- **Form Fields:**
  - Destination Name (required)
  - Country (required)
  - Description (required)
  - Image URL (optional)
- **Validation:** All required fields must be filled before submission
- **API Integration:** Sends POST request to `/destinations` endpoint
- **Success:** Redirects to destination management page after 2 seconds

### 3. User Management

#### View All Users
- **Route:** `/admin/users`
- **Features:**
  - Display all users in a table format
  - Shows User ID, Email, Full Name, Phone, and Role
  - Change user role (Customer/Admin) via dropdown
  - Link to create new users

#### Create New User
- **Route:** `/admin/users/create`
- **Form Fields:**
  - Email Address (required, must be valid)
  - Password (required, minimum 6 characters)
  - Full Name (required)
  - Phone Number (required)
  - Role (Customer or Admin, defaults to Customer)
- **Validation:**
  - Email format validation
  - Password minimum 6 characters
  - All fields required
- **API Integration:** Sends POST request to `/admin/signup/user` endpoint
- **Success:** Redirects to user management page after 2 seconds

## File Structure

### Frontend Components

```
src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.jsx       # Main admin dashboard
│       ├── ManagePackages.jsx        # View and delete packages
│       ├── CreatePackage.jsx         # Create new package form
│       ├── ManageDestinations.jsx    # View and delete destinations
│       ├── CreateDestination.jsx     # Create new destination form
│       ├── ManageUsers.jsx           # View and manage users
│       └── CreateUser.jsx            # Create new user form
├── styles/
│   ├── AdminDashboard.css            # Admin dashboard styling
│   ├── AdminManage.css               # Manage pages (tables) styling
│   ├── AdminForms.css                # Form pages styling
│   └── Navbar.css                    # Updated navbar with admin link
├── components/
│   ├── Navbar.jsx                    # Updated navbar with admin link
│   └── ProtectedRoute.jsx            # Route protection component
└── services/
    ├── api.js                        # Axios instance
    └── endpoints.js                  # API functions
```

## API Endpoints Used

### Packages
- `GET /packages?page=1&limit=100` - Get all packages
- `POST /packages` - Create new package
- `DELETE /packages/:id` - Delete package

### Destinations
- `GET /destinations?page=1&limit=100` - Get all destinations
- `POST /destinations` - Create new destination
- `DELETE /destinations/:id` - Delete destination

### Users
- `GET /admin/users?page=1&limit=100` - Get all users (admin only)
- `POST /admin/signup/user` - Create new user (admin only)
- `PUT /admin/user/:id/role` - Update user role (admin only)

## Styling

### Color Scheme
- Primary: #007bff (Blue)
- Danger: #dc3545 (Red)
- Secondary: #6c757d (Gray)
- Gradient: Linear gradient from #667eea to #764ba2 (Admin Dashboard)

### Responsive Design
- All admin pages are fully responsive
- Mobile-friendly breakpoint at 768px
- Flexible grid layouts that adapt to screen size

## Error Handling

- All forms include error messages displayed to the user
- Failed API calls show appropriate error messages
- Success messages confirm successful operations
- Loading states prevent multiple submissions

## Features Not Yet Implemented

The following features are prepared but not yet fully implemented:
- Edit Package functionality
- Edit Destination functionality
- Manage Bookings page
- Manage Payments page
- Manage Reviews page
- Payment processing integration
- Advanced filtering and search

## Security

- Admin routes are protected using `AdminRoute` component
- Only users with `role === 'admin'` can access admin pages
- JWT tokens are required for all protected requests
- Passwords are hashed using bcrypt on the backend

## Testing the Admin Features

1. **Login as Admin:**
   - Navigate to `/login`
   - Enter: harry@gmail.com / harry@1234
   - Click "Login"

2. **Access Admin Dashboard:**
   - Click the red "Admin" button in navbar
   - View the admin dashboard with 6 management cards

3. **Create a Destination:**
   - Click "Manage Destinations"
   - Click "Create New Destination"
   - Fill in the form with sample data
   - Click "Create Destination"

4. **Create a Package:**
   - Click "Manage Packages"
   - Click "Create New Package"
   - Select a destination from dropdown
   - Fill in other required fields
   - Click "Create Package"

5. **Create a User:**
   - Click "Manage Users"
   - Click "Create User"
   - Fill in email, password, name, phone
   - Select role (Customer or Admin)
   - Click "Create User"

6. **Manage Users:**
   - Go to "Manage Users"
   - Use the role dropdown to change a user's role between Customer and Admin

## Known Issues

- None currently reported

## Future Enhancements

1. Edit and Update functionality for packages, destinations, and users
2. Bulk operations (delete multiple items at once)
3. Advanced filtering and sorting options
4. Export data to CSV/Excel
5. Admin activity logs
6. Dashboard statistics and charts
7. User activity monitoring
8. Email notifications

## Support

For issues or questions about the admin features, please refer to the main project documentation or contact the development team.
