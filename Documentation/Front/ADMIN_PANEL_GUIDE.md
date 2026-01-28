# Admin Panel - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Admin Features](#admin-features)
4. [Detailed Feature Guides](#detailed-feature-guides)
5. [Troubleshooting](#troubleshooting)
6. [API Reference](#api-reference)

## Overview

The IMS Travel Application admin panel provides a comprehensive interface for managing travel packages, destinations, users, bookings, payments, and reviews. The admin panel is built with React and integrates seamlessly with the Node.js/Express backend.

### Key Features
- **Package Management** - Create, view, and delete travel packages
- **Destination Management** - Manage travel destinations
- **User Management** - Create users and assign roles
- **Role-Based Access** - Separate admin and customer interfaces
- **Responsive Design** - Works on all devices
- **Real-Time Data** - Instant updates from backend API

## Getting Started

### Admin Credentials
```
Email: harry@gmail.com
Password: harry@1234
```

### Login Steps
1. Navigate to http://localhost:5174/login
2. Enter admin email and password
3. Click "Login"
4. You'll be redirected to dashboard

### Access Admin Panel
1. After login, click the red "Admin" button in the navbar
2. Or navigate directly to http://localhost:5174/admin/dashboard
3. You'll see the admin dashboard with 6 management cards

## Admin Features

### 1. Package Management

**Access:** Click "Manage Packages" card on admin dashboard

#### View All Packages
- Displays table with all packages
- Shows: Package ID, Title, Duration, Price, Max People
- Delete button to remove packages
- Create New Package button

#### Create Package
- **URL:** /admin/packages/create
- **Required Fields:**
  - Package Title
  - Destination (dropdown selector)
  - Duration in Days
  - Base Price
  - Max People
  - Description
- **Optional Fields:**
  - Image URL

**Form Validation:**
- All required fields must be filled
- Success message on creation
- Automatic redirect to packages list

### 2. Destination Management

**Access:** Click "Manage Destinations" card on admin dashboard

#### View All Destinations
- Displays table with all destinations
- Shows: Destination ID, Name, Country, Description
- Delete button to remove destinations
- Create New Destination button

#### Create Destination
- **URL:** /admin/destinations/create
- **Required Fields:**
  - Destination Name
  - Country
  - Description
- **Optional Fields:**
  - Image URL

**Form Validation:**
- All required fields must be filled
- Success message on creation
- Automatic redirect to destinations list

### 3. User Management

**Access:** Click "Manage Users" card on admin dashboard

#### View All Users
- Displays table with all users
- Shows: User ID, Email, Full Name, Phone, Role
- Role selector dropdown (Customer/Admin)
- Create User button
- Real-time role updates

#### Create User
- **URL:** /admin/users/create
- **Required Fields:**
  - Email Address (valid format)
  - Password (6+ characters)
  - Full Name
  - Phone Number
- **Optional Fields:**
  - Role (defaults to Customer)

**Form Validation:**
- Email format validation
- Password minimum 6 characters
- All required fields validation
- Success message on creation
- Automatic redirect to users list

## Detailed Feature Guides

### Creating a Package

1. Go to Admin Dashboard → Manage Packages
2. Click "Create New Package" button
3. Fill in the form:
   - **Title:** Enter package name (e.g., "Paris 5-Day Tour")
   - **Destination:** Select from dropdown (populated from destinations)
   - **Duration:** Enter number of days
   - **Price:** Enter base price in rupees
   - **Max People:** Enter maximum capacity
   - **Description:** Enter detailed description
   - **Image URL:** (optional) Enter image URL
4. Click "Create Package"
5. Wait for success message
6. You'll be redirected to packages list

**Tips:**
- Make sure destination exists before creating package
- Use realistic prices and durations
- Add descriptive package details
- Include image URL for better presentation

### Creating a Destination

1. Go to Admin Dashboard → Manage Destinations
2. Click "Create New Destination" button
3. Fill in the form:
   - **Name:** Destination name (e.g., "Paris")
   - **Country:** Country name (e.g., "France")
   - **Description:** Detailed description
   - **Image URL:** (optional) Image URL
4. Click "Create Destination"
5. Wait for success message
6. You'll be redirected to destinations list

**Tips:**
- Keep destination names short and clear
- Write engaging descriptions
- Add high-quality image URLs
- Create destinations before packages

### Creating a User

1. Go to Admin Dashboard → Manage Users
2. Click "Create User" button
3. Fill in the form:
   - **Email:** Valid email address (e.g., user@example.com)
   - **Password:** Strong password (6+ characters)
   - **Full Name:** User's full name
   - **Phone:** Valid phone number
   - **Role:** Select Customer or Admin (optional)
4. Click "Create User"
5. Wait for success message
6. You'll be redirected to users list

**Tips:**
- Use strong passwords
- Email format must be valid (email@domain.com)
- Assign roles carefully
- Keep user information accurate

### Managing User Roles

1. Go to Admin Dashboard → Manage Users
2. Find the user in the table
3. Click the Role dropdown
4. Select "Customer" or "Admin"
5. Role updates automatically

**Role Types:**
- **Customer:** Regular user, can browse and book packages
- **Admin:** Full access to admin panel, can manage all resources

## Troubleshooting

### Cannot Login as Admin
**Problem:** Login fails with "Invalid Password"
**Solution:**
- Verify email is: harry@gmail.com
- Verify password is: harry@1234
- Clear browser cache
- Try incognito/private mode
- Check backend is running

### Cannot Access Admin Dashboard
**Problem:** Redirected to login when clicking Admin button
**Solution:**
- Make sure you're logged in
- Verify your user role is "admin"
- Check JWT token in localStorage (browser DevTools → Storage)
- Re-login and try again

### Form Validation Errors
**Problem:** Error message appears when submitting form
**Solution:**
- Check all required fields are filled (marked with *)
- Email must be valid format (email@example.com)
- Password must be 6+ characters
- Phone must be valid
- Try clearing form and re-entering

### Table Not Loading
**Problem:** "Loading..." appears but never completes
**Solution:**
- Check backend is running on port 4000
- Check network tab in DevTools for API errors
- Look for CORS errors
- Refresh the page
- Check if JWT token is valid

### API Errors
**Problem:** Error message about API failure
**Solution:**
- Verify backend server is running: `npm start`
- Check backend is on port 4000
- Look at DevTools Network tab for response
- Check backend logs for errors
- Verify database connection is working

## API Reference

### Package Endpoints

#### Get All Packages
```
GET /packages?page=1&limit=100
```
**Response:**
```json
{
  "data": [
    {
      "package_id": 1,
      "title": "Paris Tour",
      "dest_id": 1,
      "duration_days": 5,
      "base_price": 50000,
      "max_people": 20,
      "description": "Amazing tour of Paris"
    }
  ]
}
```

#### Create Package
```
POST /packages
Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "Paris Tour",
  "dest_id": 1,
  "duration_days": 5,
  "base_price": 50000,
  "max_people": 20,
  "description": "Amazing tour of Paris",
  "image_url": "https://example.com/image.jpg"
}
```

#### Delete Package
```
DELETE /packages/:id
```

### Destination Endpoints

#### Get All Destinations
```
GET /destinations?page=1&limit=100
```

#### Create Destination
```
POST /destinations
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Paris",
  "country": "France",
  "description": "Beautiful city in France",
  "image_url": "https://example.com/image.jpg"
}
```

#### Delete Destination
```
DELETE /destinations/:id
```

### User Endpoints

#### Get All Users
```
GET /admin/users
Authorization: Bearer <token>
```

#### Create User
```
POST /admin/signup/user
Content-Type: application/json
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

#### Update User Role
```
PUT /admin/user/:id/role
Content-Type: application/json
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "role": "admin"
}
```

## Security Notes

1. **Authentication:** All admin endpoints require JWT token
2. **Authorization:** Only admin users can access admin panel
3. **Validation:** All inputs validated on frontend and backend
4. **Password:** Hashed using bcrypt on backend
5. **Tokens:** Stored in localStorage and sent in Authorization header

## Performance Tips

1. **Use Pagination:** Data loads in batches for better performance
2. **Minimize Images:** Use optimized images in Image URL fields
3. **Clear Cache:** If data seems stale, clear browser cache
4. **Use Descriptions:** Write concise, meaningful descriptions

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Keyboard Shortcuts

- Tab - Navigate between form fields
- Enter - Submit form
- Escape - Close modal dialogs

## Common Tasks

### Task: Create Complete Travel Package

1. Create destination first (Admin → Destinations → Create)
2. Create package using that destination (Admin → Packages → Create)
3. Package is now ready for users to book

### Task: Add New Admin User

1. Go to Admin → Users → Create User
2. Fill email, password, name, phone
3. Select "Admin" in Role field
4. Create user
5. New admin can login and access admin panel

### Task: Manage Existing Package

1. Go to Admin → Packages
2. View package in table
3. To delete: Click Delete button and confirm
4. To edit: Feature coming soon

## Next Steps

1. Create destinations
2. Create packages
3. Create users
4. Test booking functionality
5. Monitor user activities

## Support

For detailed information, refer to:
- ADMIN_FEATURES_DOCUMENTATION.md
- ADMIN_QUICK_START.md
- ADMIN_IMPLEMENTATION_SUMMARY.md

For issues, check the troubleshooting section or contact support.
