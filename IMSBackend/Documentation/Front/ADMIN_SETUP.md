# 🔐 Admin Account Setup Guide

## How to Create the First Admin Account

The IMS system has a **first admin bootstrap mechanism**. The first user with `role='admin'` can be created **without authentication**.

### Method 1: Using the Admin Creation Endpoint (Recommended)

**POST** to: `http://localhost:4000/admin/signup/user`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123456",
  "full_name": "Admin User",
  "phone": "+1234567890",
  "role": "admin"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456",
    "full_name": "Admin User",
    "phone": "+1234567890",
    "role": "admin"
  }'
```

### Method 2: Direct Database Insert (If Endpoint Fails)

```sql
-- First, check if admin exists
SELECT * FROM users WHERE role = 'admin';

-- If no admin exists, insert one:
INSERT INTO users (email, password_hash, full_name, phone, role)
VALUES (
  'admin@example.com',
  '$2b$10$HASH_HERE', -- Use bcrypt hash of your password
  'Admin User',
  '+1234567890',
  'admin'
);
```

To generate bcrypt hash online or in Node.js:
```javascript
const bcrypt = require('bcrypt');
const password = 'admin123456';
bcrypt.hash(password, 10, (err, hash) => {
  console.log(hash); // Use this in the INSERT statement
});
```

---

## How to Login as Admin

Once the admin account is created:

1. Go to `http://localhost:5173/login`
2. Enter admin email: `admin@example.com`
3. Enter admin password: `admin123456`
4. Click Login

---

## Verify Admin Status

**GET** `http://localhost:4000/users/profile/1` (assuming user_id=1)

**With header:**
```
Authorization: Bearer <your_jwt_token>
```

Should return:
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "admin"
  }
}
```

---

## Troubleshooting

### Error: "Database error"
- ✅ Make sure MySQL is running
- ✅ Check backend is running on port 4000
- ✅ Verify database credentials

### Error: "User already exists"
- ✅ The email is already taken
- ✅ Use a different email address

### Error: "Invalid role"
- ✅ Role must be exactly `"admin"` (lowercase)
- ✅ Check spelling

### Cannot login as admin
- ✅ Verify the account was created (check database)
- ✅ Use correct email and password
- ✅ Check if role is set to 'admin' in database

---

## Check Current Admin Accounts

**Query to verify admin exists:**
```sql
SELECT user_id, email, full_name, role FROM users WHERE role = 'admin';
```

If result is empty → you need to create the first admin

---

## Important Notes

⚠️ **First Admin Creation:**
- Can be created without authentication
- No JWT token needed
- After first admin is created, only admins can create more admins

⚠️ **Admin Privileges:**
- Can create/delete users
- Can manage all packages, bookings, payments
- Can access admin routes
- Can change user roles

⚠️ **Security:**
- Always use a strong password (min 6 chars recommended 12+)
- Don't share admin credentials
- Regularly audit admin accounts

---

**Status:** Ready to create admin  
**Date:** January 22, 2026
