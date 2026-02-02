# 🚀 IMS - Quick Start (5 Minutes)

## Prerequisites
- MySQL running (with database `Fin` from Fin.sql)
- Node.js installed
- Backend dependencies installed

---

## Step 1: Start Backend (Terminal 1)

```bash
cd d:\IMS\IMSBackend
node Server.js
```

✅ You should see: `Server started at port 4000`

---

## Step 2: Start Frontend (Terminal 2)

```bash
cd d:\IMS\Frontend\IMSF
npm run dev
```

✅ You should see: `Local: http://localhost:5173/`

---

## Step 3: Create Admin Account

**Use Postman or cURL:**

```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin@123456",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

✅ Should return token and user_id

---

## Step 4: Open Frontend

Go to: **http://localhost:5173**

---

## Step 5: Test Login

**Option A: Login as Admin**
- Email: `admin@test.com`
- Password: `Admin@123456`

**Option B: Create New User**
- Click "Sign Up"
- Fill form
- Click "Sign Up"
- Login with new credentials

---

## Step 6: Explore Features

✅ Click "Explore Packages" - Browse packages  
✅ Click "Dashboard" - View dashboard  
✅ Click "My Bookings" - View bookings  
✅ Click profile name - Edit profile  

---

## ✅ System Ready!

Everything is now integrated and working:
- ✅ Frontend connected to backend
- ✅ API requests working
- ✅ Authentication functional
- ✅ Database connected

**Happy coding!** 🎉

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MySQL, port 4000 free |
| Frontend won't connect | Check `.env.local` has correct URL |
| Can't create admin | Verify database has `fin` table structure |
| Login fails | Check email/password correct, user exists |
| CORS error | Backend should auto-handle, check running on 4000 |

See `COMPLETE_INTEGRATION_GUIDE.md` for detailed help.
