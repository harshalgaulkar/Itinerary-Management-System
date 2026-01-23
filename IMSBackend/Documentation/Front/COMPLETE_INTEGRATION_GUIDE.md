# ✅ Complete Integration Checklist

**Date:** January 22, 2026  
**Status:** Ready for Testing

---

## Configuration Verification

### ✅ Backend Setup
- [x] Server.js configured correctly
- [x] Port: 4000
- [x] All 8 routes registered
- [x] Database: Fin (MySQL)
- [x] Database User: root
- [x] Database Password: manager
- [x] Admin routes before auth middleware (allows first admin signup)
- [x] Protected routes after auth middleware

### ✅ Frontend Setup
- [x] React + Vite configured
- [x] API URL: http://localhost:4000
- [x] .env.local file created
- [x] Dependencies installed (react-router-dom, axios)

### ✅ Database
- [x] MySQL running
- [x] Database: Fin
- [x] 8 tables created
- [x] Relationships configured

---

## Step-by-Step Startup Guide

### Terminal 1: Start Backend

```bash
cd d:\IMS\IMSBackend
node Server.js
```

**Expected Output:**
```
Server started at port 4000
```

### Terminal 2: Start Frontend

```bash
cd d:\IMS\Frontend\IMSF
npm run dev
```

**Expected Output:**
```
VITE v... ready in XXX ms
➜ Local: http://localhost:5173/
```

---

## Testing Workflow

### 1. Create First Admin Account

**POST** `http://localhost:4000/admin/signup/user`

**JSON Body:**
```json
{
  "email": "admin@test.com",
  "password": "Admin@123456",
  "full_name": "System Administrator",
  "phone": "+1234567890",
  "role": "admin"
}
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "email": "admin@test.com",
    "token": "eyJhbGc...",
    "role": "admin"
  }
}
```

### 2. Open Frontend

Open browser: `http://localhost:5173`

You should see the **IMS Travel** home page

### 3. Test User Signup

Click "Sign Up" and create a test user:
- Full Name: John Doe
- Email: user@test.com
- Password: User@123456
- Phone: +1234567890

### 4. Test User Login

Click "Login" with credentials:
- Email: user@test.com
- Password: User@123456

Should redirect to dashboard

### 5. Test Admin Login

Login as admin with:
- Email: admin@test.com
- Password: Admin@123456

### 6. Test Package Browsing

Click "Explore Packages" (public page, no auth needed)

Should show list of packages from database

### 7. Test Booking

- Login as regular user
- Go to Packages
- Click "View Details" on a package
- Click "Book Now"
- Should redirect to bookings page

### 8. Test Profile

After login, click profile name in navbar

Should show profile information

---

## API Endpoints to Test

| Endpoint | Method | Auth | Expected |
|----------|--------|------|----------|
| /users/signin | POST | ❌ | Login returns token |
| /users/signup | POST | ❌ | User created |
| /users/profile/:id | GET | ✅ | User data returned |
| /admin/signup/user | POST | ❌* | Admin created (first only) |
| /packages | GET | ❌ | All packages returned |
| /packages/:id | GET | ❌ | Package details |
| /bookings | POST | ✅ | Booking created |
| /bookings/:id | GET | ✅ | Booking details |
| /payments | POST | ✅ | Payment created |
| /reviews | POST | ✅ | Review created |

*First admin signup doesn't need auth; subsequent require admin token

---

## Troubleshooting

### Backend Not Starting

```
Error: connect ECONNREFUSED
```

**Fix:**
- Start MySQL service
- Verify database credentials in `utils/db.js`
- Check port 4000 not in use

### Frontend Can't Connect

```
ERR_CONNECTION_REFUSED or CORS error
```

**Fix:**
- Verify backend running on 4000
- Check `.env.local` has correct URL: `http://localhost:4000`
- Clear browser cache (Ctrl+Shift+Del)
- Restart frontend: `npm run dev`

### Admin Not Created

```
Error: Database error
```

**Fix:**
```sql
-- Check if admin table is correct
SELECT * FROM users WHERE role = 'admin';

-- Or insert directly
INSERT INTO users (email, password_hash, full_name, phone, role) 
VALUES ('admin@test.com', '$2b$10$HASH', 'Admin', '+1234567890', 'admin');
```

### Login Returns Invalid Error

**Fix:**
- Ensure user exists in database: `SELECT * FROM users WHERE email = 'your_email';`
- Check password is at least 6 characters
- Verify email format is correct

---

## Quick Reference

### Backend Files
- `Server.js` - Main server file
- `routes/` - API endpoints
- `utils/db.js` - Database connection
- `utils/config.js` - Configuration

### Frontend Files
- `src/pages/` - Page components
- `src/services/` - API service
- `src/context/` - Auth context
- `.env.local` - Configuration

### Database Files
- `Fin.sql` - Database schema

---

## System Architecture Summary

```
Frontend (React)
    ↓ (HTTP/REST)
Backend (Node.js/Express)
    ↓ (MySQL Protocol)
Database (MySQL)
```

---

## Next Steps

1. ✅ Start backend server
2. ✅ Start frontend server
3. ✅ Create admin account via API
4. ✅ Test user registration
5. ✅ Test user login
6. ✅ Browse packages
7. ✅ Create bookings
8. ✅ Process payments

---

## Important Reminders

⚠️ **Before deploying:**
- Change JWT secret in `config.js`
- Use strong database passwords
- Enable HTTPS in production
- Set NODE_ENV=production
- Use environment variables for sensitive data

⚠️ **Development Mode:**
- CORS enabled (change in production)
- Default JWT secret used (change in production)
- Database password in plain text (use env vars in production)

---

**Status:** ✅ All Components Ready  
**Startup Time:** ~5 minutes  
**Test Time:** ~10 minutes  

You're all set! 🚀

