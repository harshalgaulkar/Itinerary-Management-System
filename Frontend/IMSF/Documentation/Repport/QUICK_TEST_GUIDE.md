# Quick Test - Verify Backend Integration

## Before You Test
Make sure your backend is running at `http://localhost:4000`

## Test 1: Direct API Test (No Frontend)

Open your browser console (F12) and test endpoints directly:

```javascript
// Test 1: Create User
fetch('http://localhost:4000/admin/signup/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123'
  })
})
.then(r => r.json())
.then(d => console.log('Create User Result:', d))
.catch(e => console.error('Create User Error:', e));

// Test 2: Get All Users (Primary endpoint)
fetch('http://localhost:4000/admin/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(d => console.log('Admin Users Result:', d))
.catch(e => console.error('Admin Users Error:', e));

// Test 3: Get All Users (Fallback endpoint)
fetch('http://localhost:4000/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(d => console.log('Users Fallback Result:', d))
.catch(e => console.error('Users Fallback Error:', e));
```

Expected results:
- ✅ All three should return status **200** or **201**
- ✅ Both `/admin/users` and `/users` should return user data
- ✅ `/admin/signup/user` should return created user confirmation

## Test 2: Test Frontend Admin Dashboard

1. Navigate to: `http://localhost:5173/admin/dashboard`
2. Open browser console (F12 → Console)
3. Look for these logs:
```
✓ Packages: X
✓ Bookings: Y | Revenue: ₹Z
✓ Users: N
```

**Expected:**
- Packages count > 0 ✓
- Bookings count > 0 ✓
- Users count > 0 ✓
- Revenue amount > 0 ✓

**If you see 0s:**
- Check if your backend has sample data
- Check backend logs for errors
- Verify JWT token is valid

## Test 3: Test ManageUsers Page

1. Navigate to: `http://localhost:5173/admin/users`
2. Open browser console (F12 → Console)
3. Look for these logs:
```
📥 Fetching users...
Response: {...}
✓ Extracted 8 users
```

**Expected:**
- Users list populates ✓
- No error messages ✓
- User count matches dashboard ✓

**If users = 0:**
- Check if your `/admin/users` endpoint returns empty array
- Check if response format is different
- Test `/users` endpoint fallback

## Test 4: Response Format Detection

The code automatically detects ANY of these formats:

```javascript
// Format 1: Nested data
{
  "data": [{"id": 1}, {"id": 2}]
}

// Format 2: Double nested
{
  "data": {
    "data": [{"id": 1}]
  }
}

// Format 3: Users key
{
  "data": {
    "users": [{"id": 1}]
  }
}

// Format 4: Direct array
[{"id": 1}, {"id": 2}]

// Format 5: Result key
{
  "data": {
    "result": [{"id": 1}]
  }
}

// All of above work automatically! ✓
```

## Debugging Checklist

### If user count shows 0:
- [ ] Backend has users in database
- [ ] JWT token is valid and sent with request
- [ ] Response format is one of the supported formats
- [ ] No CORS errors in console

### If getting 404 error:
- [ ] Using `/admin/users` endpoint (not `/api/admin/users`)
- [ ] Fallback to `/users` if primary fails
- [ ] Check backend route definitions

### If getting 401 error:
- [ ] You're logged in
- [ ] JWT token is in localStorage
- [ ] Token hasn't expired
- [ ] Authorization header is set

### If getting connection refused:
- [ ] Backend server is running
- [ ] Backend is on localhost:4000
- [ ] Check backend terminal for start message

## Console Logs Reference

**Success logs you should see:**
```
✓ Packages: 5
✓ Bookings: 12 | Revenue: ₹45000
✓ Users: 8
```

**Fallback log (if /admin/users fails):**
```
⚠ /admin/users failed, trying /users fallback...
```

**Error logs if something fails:**
```
✗ Bookings error: Network Error
✗ Users error: 401 Unauthorized
```

## Sample Data Check

To verify your backend has data, check:

```bash
# In your backend terminal or MongoDB Compass
# Users collection should have documents
# Example:
{
  "_id": ObjectId(...),
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

If no users exist, create one via:
1. Admin → Manage Users → Add New User
2. OR direct API call (Test 1 above)

## Next Steps After Testing

1. ✅ All tests pass → Go to production
2. ✅ Some tests fail → Check console logs and debug
3. ✅ Response format different → Update dataExtractor.js (add new format)
4. ✅ Endpoint different → Update endpoints.js (change URL)

Need help? Check `ENDPOINT_FIX_GUIDE.md` for more details.
