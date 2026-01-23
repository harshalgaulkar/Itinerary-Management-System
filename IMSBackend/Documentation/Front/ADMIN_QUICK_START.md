# Quick Start Guide - Admin Features

## Admin Login

1. Go to the login page: `http://localhost:5174/login`
2. Enter admin credentials:
   - **Email:** harry@gmail.com
   - **Password:** harry@1234
3. Click "Login"

## Access Admin Dashboard

After successful login, you'll see the navbar with an "Admin" button (red color).
Click the "Admin" button to access the admin dashboard.

## Main Admin Features

### 1. Manage Packages
Create and manage travel packages for your travel business.

**Steps:**
1. Click "Manage Packages" card on admin dashboard
2. View all existing packages in table format
3. Click "Create New Package" to add a new package
4. Fill in the form:
   - Package Title
   - Select Destination (dropdown)
   - Duration in Days
   - Base Price
   - Max People
   - Description
   - Image URL (optional)
5. Click "Create Package"

**Manage Packages:**
- View all packages in a table
- Click "Delete" to remove a package
- Edit button available (will be implemented in next version)

### 2. Manage Destinations
Add and manage travel destinations.

**Steps:**
1. Click "Manage Destinations" card on admin dashboard
2. View all existing destinations
3. Click "Create New Destination" to add a new destination
4. Fill in the form:
   - Destination Name
   - Country
   - Description
   - Image URL (optional)
5. Click "Create Destination"

**Manage Destinations:**
- View all destinations in a table
- Click "Delete" to remove a destination
- Edit button available (will be implemented in next version)

### 3. Manage Users
Create users and manage their roles (Customer or Admin).

**Create New User:**
1. Click "Manage Users" card on admin dashboard
2. Click "Create User"
3. Fill in the form:
   - Email Address (must be valid format)
   - Password (minimum 6 characters)
   - Full Name
   - Phone Number
   - Role (Customer or Admin)
4. Click "Create User"

**Manage User Roles:**
1. Go to "Manage Users"
2. Use the Role dropdown to change a user's role
3. Select between "Customer" and "Admin"
4. Changes are saved immediately

### 4. Manage Bookings
View and manage customer bookings (coming soon).

### 5. Manage Payments
Track and manage payment transactions (coming soon).

### 6. Manage Reviews
Monitor customer reviews and ratings (coming soon).

## Tips

- **Validation:** All required fields are marked with asterisks (*)
- **Errors:** Error messages appear in red if validation fails
- **Success:** You'll see a green success message and be redirected after 2 seconds
- **Delete:** Always confirm before deleting items
- **Mobile:** All pages are fully responsive and work on mobile devices

## URL Routes

| Page | URL |
|------|-----|
| Admin Dashboard | `/admin/dashboard` |
| Manage Packages | `/admin/packages` |
| Create Package | `/admin/packages/create` |
| Manage Destinations | `/admin/destinations` |
| Create Destination | `/admin/destinations/create` |
| Manage Users | `/admin/users` |
| Create User | `/admin/users/create` |

## API Integration

The admin features use the following API endpoints:

### Packages
- `GET /packages?page=1&limit=100` - Get all packages
- `POST /packages` - Create new package
- `DELETE /packages/:id` - Delete package

### Destinations
- `GET /destinations?page=1&limit=100` - Get all destinations
- `POST /destinations` - Create new destination
- `DELETE /destinations/:id` - Delete destination

### Users
- `GET /admin/users` - Get all users
- `POST /admin/signup/user` - Create new user
- `PUT /admin/user/:id/role` - Update user role

## Troubleshooting

### Cannot access admin dashboard
- Make sure you're logged in as an admin
- Check that your user role is set to "admin" in the database
- Clear your browser cache and login again

### Form validation errors
- Fill in all required fields (marked with *)
- Check email format is valid (email@example.com)
- Password must be at least 6 characters
- Phone number should be in valid format

### API errors
- Make sure the backend server is running on port 4000
- Check network tab in browser dev tools for specific error messages
- Verify JWT token is being sent in Authorization header

## Features Roadmap

✅ **Completed:**
- Admin login and authentication
- Create packages
- View all packages
- Delete packages
- Create destinations
- View all destinations
- Delete destinations
- Create users
- View all users
- Update user roles

⏳ **Coming Soon:**
- Edit packages
- Edit destinations
- Edit users
- Manage bookings
- Manage payments
- Manage reviews
- Dashboard statistics
- User activity logs
- Email notifications

## Support

For more details, see the full documentation at: `ADMIN_FEATURES_DOCUMENTATION.md`
