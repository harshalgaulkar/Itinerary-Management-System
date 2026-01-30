# ⚠️ UNAUTHORIZED: Admin Access Required

## Issue

You're getting: **"Unauthorized: Admin access required"**

This means:
- ✅ Your token is valid (backend received it)
- ❌ But your user account does NOT have admin role

---

## Why This Happens

The backend checks the user's role before allowing admin operations:
```
1. User logs in → Token created
2. User token contains role: "user" or "admin"
3. When creating destination → Backend checks role
4. If role ≠ "admin" → Rejected with "Admin access required"
```

---

## Solution

### Option 1: Use an Admin Account (If Available)
1. Logout from your current account
2. Login with an admin account
3. Try creating destination again

**Admin account credentials needed from backend team**

### Option 2: Backend Team Needs to Grant Admin Role
Your account needs to be promoted to admin:

```sql
-- Backend team must run this on database
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

---

## Debug: Check Your Current Role

The app now logs your role. Check console:

```
📝 Login response: {token: "...", user_id: 1, role: "user"}
✅ Stored role: "user"  ← This should be "admin"
```

If it shows `"user"`, you need to be promoted to admin.

---

## Step-by-Step Fix

### For Users:
1. Contact backend team
2. Ask them to promote your account to admin
3. They need to update your role in database
4. Re-login to get new token with admin role

### For Backend Team:
1. Access your database
2. Find the user's record
3. Update role field to `'admin'`
4. User should re-login to get updated token

---

## Verification

After backend team updates your role:

1. **Logout** from app
2. **Login** again with same credentials
3. Check console for: `✅ Stored role: "admin"`
4. Try creating destination → Should work!

---

## Console Debugging

Now the app logs:
```
📝 Login response: {...}     ← Full login response
✅ Stored role: "admin"      ← Your role status
👤 Current user role: admin  ← When trying to create
🔑 Token found, length: 234  ← Token is present
📤 Request headers: {...}    ← Headers being sent
📥 Response status: 201      ← Should be 201 on success
```

Watch these logs to verify admin role is set correctly.

---

## Backend SQL (If Needed)

```sql
-- Check current users and roles
SELECT user_id, email, role FROM users;

-- Promote a user to admin
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';

-- Verify the change
SELECT user_id, email, role FROM users WHERE email = 'your_email@example.com';
```

---

## Summary

✅ **What's working:**
- Authentication system ✓
- Token generation ✓
- API endpoints ✓

❌ **What's blocking you:**
- User account doesn't have admin role

🔧 **How to fix:**
- Backend team promotes your account to admin OR
- Use an admin account to login

---

**Contact your backend team to grant admin privileges!**

