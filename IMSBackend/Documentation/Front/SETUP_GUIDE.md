# IMS (Itinerary Management System) - Complete Setup Guide

**Date:** January 22, 2026  
**Status:** ✅ FULLY IMPLEMENTED & READY TO USE

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Testing the API](#testing-the-api)
8. [Troubleshooting](#troubleshooting)
9. [Features Implemented](#features-implemented)

---

## Project Overview

**IMS** is a complete travel booking management system with:

### Backend
- Node.js/Express REST API
- MySQL database with 8 tables
- JWT authentication
- Role-based access control (User/Admin)
- 65+ API endpoints
- Complete validation and error handling

### Frontend
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management
- Responsive design
- Authentication flow

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React 19)                         │
│  - Pages: Home, Login, Dashboard, Packages, Bookings   │
│  - Components: Navbar, ProtectedRoute                  │
│  - Context: AuthContext                                 │
│  - API: Axios with token injection                      │
└─────────────────────────────────────────────────────────┘
                          ↕
                   (HTTP/REST API)
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                  │
│  - 8 Routes: users, packages, bookings, payments, etc  │
│  - Authentication: JWT tokens                          │
│  - Validation: express-validator                       │
│  - Authorization: Role-based checks                    │
└─────────────────────────────────────────────────────────┘
                          ↕
                   (MySQL Protocol)
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Database (MySQL)                           │
│  - 8 Tables: users, destinations, packages, bookings  │
│  - Relationships: Foreign keys with cascading deletes  │
│  - Indexes: Performance optimization                   │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Setup

### Prerequisites
- Node.js 14+
- MySQL Server installed and running
- npm or yarn package manager

### Step 1: Create Database

```sql
-- Copy content from Fin.sql into MySQL
-- Or run:
mysql -u root -p < Fin.sql
```

### Step 2: Install Dependencies

```bash
cd IMSBackend
npm install
```

### Step 3: Configure Database Connection

Edit `IMSBackend/utils/config.js`:

```javascript
const host = 'localhost';      // Your MySQL host
const user = 'root';            // MySQL username
const password = '';            // MySQL password
const database = 'fin';         // Database name (from Fin.sql)
```

### Step 4: Start Backend Server

```bash
cd IMSBackend
node Server.js
```

**Expected Output:**
```
Server started at port 4000
```

Backend is now running at `http://localhost:4000`

---

## Frontend Setup

### Prerequisites
- Node.js 16+ and npm
- Backend server running

### Step 1: Install Dependencies

```bash
cd Frontend/IMSF
npm install
```

### Step 2: Configure API URL

Create `.env.local` in `Frontend/IMSF/`:

```env
VITE_API_URL=http://localhost:4000
```

### Step 3: Start Frontend Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v... ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Frontend is now running at `http://localhost:5173`

---

## Database Setup

### Tables Created

1. **users** - User accounts (customers & admins)
2. **destinations** - Travel destinations
3. **packages** - Travel packages/tours
4. **package_dates** - Package schedules
5. **package_itineraries** - Day-by-day trip details
6. **bookings** - User reservations
7. **payments** - Payment transactions
8. **reviews** - Package reviews & ratings

### Database File

Use `Fin.sql` in the root directory:

```bash
mysql -u root -p < Fin.sql
```

Or import through MySQL Workbench:
1. Open MySQL Workbench
2. File → Run SQL Script
3. Select `Fin.sql`
4. Execute

---

## Running the Application

### Terminal 1: Start Backend

```bash
cd d:\IMS\IMSBackend
node Server.js
```

### Terminal 2: Start Frontend

```bash
cd d:\IMS\Frontend\IMSF
npm run dev
```

### Open Application

Open browser and go to: **http://localhost:5173**

---

## Testing the API

### 1. User Registration

**POST** `/users/signup`

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### 2. User Login

**POST** `/users/signin`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token - copy and use in Authorization header.

### 3. Browse Packages

**GET** `/packages?page=1&limit=10`

No authentication required.

### 4. Create Booking

**POST** `/bookings` (Requires Authentication)

```json
{
  "package_date_id": 1,
  "seats": 2
}
```

Include JWT token in Authorization header:
```
Authorization: Bearer <token_from_login>
```

### 5. Make Payment

**POST** `/payments` (Requires Authentication)

```json
{
  "booking_id": 1,
  "amount": 10000,
  "payment_method": "card",
  "status": "success"
}
```

---

## Troubleshooting

### Backend Not Starting

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
- Ensure MySQL server is running
- Check database credentials in `config.js`
- Verify database name matches `Fin`

### Frontend Can't Connect to Backend

**Error:** `CORS error` or `Network timeout`

**Solution:**
- Verify backend is running on port 4000
- Check `.env.local` has correct `VITE_API_URL`
- Ensure no firewall blocks port 4000

### Database Import Failed

**Error:** `Table already exists`

**Solution:**
```sql
-- Drop existing database
DROP DATABASE IF EXISTS fin;

-- Import again
mysql -u root -p < Fin.sql
```

### Port Already in Use

**Backend (Port 4000):**
```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
```bash
# Vite will use next available port automatically
```

---

## Features Implemented

### ✅ User Management
- User Registration with validation
- User Login with JWT
- Profile viewing and updating
- Password hashing with bcrypt
- Role-based access (user/admin)

### ✅ Package Management
- Browse all packages with pagination
- Filter by destination
- Search by title
- View package details
- View itinerary (day-by-day)
- View available dates

### ✅ Booking System
- Create bookings with seat selection
- View booking details
- Track booking status (pending → confirmed → completed)
- Cancel bookings
- Automatic seat management

### ✅ Payment Processing
- Create payments
- Track payment status
- Support multiple payment methods (card, UPI, netbanking, cash)
- Automatic booking confirmation on full payment
- Payment summaries with balance due

### ✅ Review & Ratings
- Leave reviews with 1-5 star ratings
- View package reviews and average rating
- One review per booking
- Only confirmed/completed bookings can review

### ✅ Admin Features
- Create new users
- View all users
- Update user roles
- Delete users
- Manage destinations
- Create/update/delete packages
- Manage package dates and itineraries

### ✅ Security Features
- JWT authentication
- Password hashing
- Role-based authorization
- CORS protection
- Input validation
- Error handling
- Audit trail for sensitive operations

---

## API Endpoints Summary

| Category | Count | Examples |
|----------|-------|----------|
| Users | 7 | signin, signup, profile, bookings |
| Admin | 4 | create user, update role, delete user |
| Destinations | 6 | list, create, update, delete |
| Packages | 6 | list, get, create, update, delete |
| Package Master | 11 | advanced package operations |
| Itineraries | 7 | day-wise itinerary management |
| Bookings | 9 | create, list, update, cancel, confirm |
| Payments | 9 | create, list, confirm, reject |
| Reviews | 6 | create, list, update, delete |
| **TOTAL** | **65+** | **All endpoints documented** |

---

## Documentation Files

**Backend Documentation** (`IMSBackend/Documentation/`):
- `API_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `QUICK_REFERENCE.md` - Quick lookup guide
- `SETUP_AND_TESTING_GUIDE.md` - Setup & testing
- `PROJECT_COMPLETION_REPORT.md` - Project summary

**Frontend Documentation** (`Frontend/IMSF/`):
- `README.md` - Frontend overview and setup

---

## Next Steps

1. ✅ Database created
2. ✅ Backend configured and running
3. ✅ Frontend configured and running
4. 🔄 Test user registration
5. 🔄 Browse packages
6. 🔄 Create a booking
7. 🔄 Process payment

---

## Support & Debugging

### Check Backend Logs

In the backend terminal, you'll see:
```
POST /users/signin
GET /packages?page=1
POST /bookings
```

### Check Network Requests

In browser DevTools (F12):
- Network tab shows all API calls
- Console shows any errors
- Application tab shows localStorage tokens

### Enable Detailed Logging

Edit `Server.js` to add logging:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

---

**Status:** ✅ Complete and Production Ready  
**Last Updated:** January 22, 2026  
**Version:** 1.0.0
