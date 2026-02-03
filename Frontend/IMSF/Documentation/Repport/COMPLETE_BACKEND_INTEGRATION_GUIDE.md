# Complete Admin Backend Integration Guide

## Overview

This guide covers everything needed to make admin functionality work with your backend.

**TL;DR:** If admin isn't working, follow these steps:
1. Start backend on port 4000
2. Verify endpoint paths match your backend
3. Check response format handling
4. Use diagnostics tools to debug

---

## Backend Requirements

Your backend **MUST** have these endpoints for admin functionality:

### User Management Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/admin/signup/user` | POST | Create new user | `{ email, password, full_name, phone, role }` | `{ user_id, email, ... }` |
| `/admin/users` | GET | Get all users | None | `[{ user_id, email, full_name, phone, role }]` |
| `/admin/user/:id/role` | PUT | Update user role | `{ role }` | `{ user_id, role, ... }` |
| `/admin/user/:id` | DELETE | Delete user | None | `{ success: true }` |

### Alternative Endpoint Patterns

If your backend uses different paths, update `src/services/endpoints.js`:

```javascript
// Your backend might use:
export const adminAPI = {
  // Option 1: Nested structure
  createUser: (userData) => apiClient.post('/admin/users/create', userData),
  getAllUsers: () => apiClient.get('/admin/users'),
  
  // Option 2: Mixed paths  
  createUser: (userData) => apiClient.post('/admin/signup/user', userData),
  getAllUsers: () => apiClient.get('/users'),  // Different path!
  
  // Option 3: API prefix
  createUser: (userData) => apiClient.post('/api/admin/users', userData),
  getAllUsers: () => apiClient.get('/api/admin/users'),
};
```

---

## Step-by-Step Setup

### Step 1: Verify Backend Configuration

**`.env.local`** (Frontend):
```env
VITE_API_URL=http://localhost:4000
```

- Backend must run on port 4000 (or update this URL)
- No trailing slash
- Must match your backend URL exactly

### Step 2: Verify Backend Endpoints

Run this to check your backend:

```bash
# Check if backend is running
curl http://localhost:4000/admin/users

# Should return: 
# - User array (with data)
# - Empty array (no users yet)
# - NOT 404 (endpoint not found)
# - NOT 500 (server error)
```

If you get 404:
1. Endpoint path is wrong
2. Update `src/services/endpoints.js`
3. Or update your backend routes

### Step 3: Check Response Format

Curl response might be one of these formats:

**Format 1: Direct Array (SIMPLEST)**
```json
[
  { "user_id": 1, "email": "user1@example.com", "full_name": "User One", "phone": "1234567890", "role": "customer" },
  { "user_id": 2, "email": "user2@example.com", "full_name": "User Two", "phone": "0987654321", "role": "admin" }
]
```

**Format 2: Wrapped in `data` object**
```json
{
  "data": [
    { "user_id": 1, "email": "user1@example.com", ... }
  ]
}
```

**Format 3: With `success` flag**
```json
{
  "success": true,
  "data": [
    { "user_id": 1, "email": "user1@example.com", ... }
  ]
}
```

**Frontend handles all formats automatically** via `src/services/responseParser.js`

### Step 4: Test Create User

```bash
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User",
    "phone": "1234567890",
    "role": "customer"
  }'

# Response should be something like:
# { "user_id": 3, "email": "newuser@example.com", ... }
# NOT: 404 or error
```

### Step 5: Verify Token/Authentication

Admin endpoints likely require authentication:

```bash
# Without token (will likely fail with 401)
curl http://localhost:4000/admin/users

# With token (will work if token is valid)
curl http://localhost:4000/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Frontend handles token automatically:
- Stores token in `localStorage.getItem('authToken')`
- Adds to all requests via interceptor
- Should work after admin login

---

## File Structure & What Each File Does

```
src/
├── services/
│   ├── api.js                          # Axios client with interceptors
│   ├── endpoints.js                    # All endpoint definitions (UPDATE THIS)
│   ├── responseParser.js               # Universal response format handler
│   ├── backendTester.js                # Testing tool for endpoints
│   └── README.md                       # Service documentation
│
├── pages/admin/
│   ├── ManageUsers.jsx                 # User list page (FIXED)
│   ├── ManageUsers_v2.jsx              # Improved version with better logging
│   ├── CreateUser.jsx                  # Create user form (FIXED)
│   ├── AdminDiagnostics.jsx            # Endpoint testing tool
│   └── ... (other admin pages)
│
├── hooks/
│   └── useAPI.js                       # Custom React hooks for API calls
│
└── App.jsx                             # Routes (make sure admin routes exist)
```

---

## How Data Flows

### Getting Users

```
ManageUsers.jsx
    ↓
adminAPI.getAllUsers()  [src/services/endpoints.js]
    ↓
apiClient.get('/admin/users')  [src/services/api.js]
    ↓ (adds token header automatically)
Backend: GET /admin/users
    ↓
Response: [...user objects...]
    ↓
extractArray(response)  [src/services/responseParser.js]
    ↓ (handles all formats)
data: [users]
    ↓
setUsers(data)
    ↓
Display in table
```

### Creating User

```
CreateUser.jsx (form submit)
    ↓
adminAPI.createUser(formData)  [src/services/endpoints.js]
    ↓
apiClient.post('/admin/signup/user', formData)
    ↓ (adds token header)
Backend: POST /admin/signup/user
    ↓
Response: { user_id, email, ... }
    ↓
Show success message
    ↓
Navigate to user list
```

---

## Debugging & Troubleshooting

### Enable Detailed Logging

Edit `src/services/api.js`:

```javascript
// At the top:
const DEBUG = true;

// Add logging:
apiClient.interceptors.request.use((config) => {
  if (DEBUG) {
    console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`);
    console.log('Headers:', config.headers);
  }
  return config;
});

apiClient.interceptors.response.use((response) => {
  if (DEBUG) {
    console.log(`📥 [API] ${response.status} ${response.config.url}`);
    console.log('Response:', response.data);
  }
  return response;
});
```

Then open browser console (F12) and:
1. Refresh page
2. Go to admin users page
3. See all API calls logged
4. Check request/response details

### Use Network Tab (F12)

1. Open DevTools: F12
2. Go to Network tab
3. Refresh page
4. Go to admin users page
5. Look for `/admin/users` request
6. Click it
7. Check:
   - **Headers** → See request details
   - **Response** → See what backend returned
   - **Preview** → Pretty-printed response

### Test Endpoints Manually

```javascript
// In browser console:

// Test 1: Check connection
fetch('http://localhost:4000/admin/users')
  .then(r => r.json())
  .then(d => console.log('✅ Backend works!', d))
  .catch(e => console.error('❌ Error:', e));

// Test 2: Using API directly
import { adminAPI } from './src/services/endpoints';
const response = await adminAPI.getAllUsers();
console.log('Response:', response);
console.log('Status:', response.status);
console.log('Data:', response.data);

// Test 3: Extract data
import { extractArray } from './src/services/responseParser';
const users = extractArray(response);
console.log('Users:', users);
```

### Backend Tester Tool

```javascript
// In browser console:
import { testAllEndpoints } from './src/services/backendTester';
await testAllEndpoints();
// See results in console
```

---

## Common Issues & Solutions

### Issue 1: Users not loading (empty list)

**Possible causes:**
1. No users in database yet
2. Backend query not working
3. Response format not parsed correctly

**Solution:**
1. Create user first via POST
2. Check backend logs for errors
3. Log response format in console

### Issue 2: 404 Not Found

**Cause:** Endpoint path doesn't exist on backend

**Solution:**
1. Check correct path on backend
2. Update `src/services/endpoints.js`
3. Verify with curl first

### Issue 3: 401 Unauthorized

**Cause:** Invalid/missing authentication token

**Solution:**
1. Admin must be logged in
2. Token stored in localStorage
3. Check login functionality first

### Issue 4: Different response format

**Cause:** Backend returns different JSON structure

**Solution:**
The response parser tries multiple formats automatically.
If still not working, check:
1. Console for actual response format
2. Update extraction in ManageUsers.jsx if needed

### Issue 5: Connection refused

**Cause:** Backend not running or wrong URL

**Solution:**
1. Start backend: `npm start`
2. Verify port 4000
3. Check `.env.local` URL
4. Curl test: `curl http://localhost:4000/admin/users`

---

## API Response Structures Your Backend Might Use

### Create User Response

```javascript
// Option 1: Object with user data
{
  user_id: 5,
  email: "newuser@example.com",
  full_name: "New User",
  phone: "1234567890",
  role: "customer"
}

// Option 2: Wrapped
{
  success: true,
  data: { user_id: 5, ... }
}

// Option 3: Message included
{
  message: "User created successfully",
  user: { user_id: 5, ... }
}
```

Frontend should handle all formats. If not:
1. Log response in console
2. Update CreateUser.jsx extraction if needed

### Get Users Response

All these formats are supported:

```javascript
// Format 1: Direct array
[{ user_id: 1, ... }, { user_id: 2, ... }]

// Format 2: In data
{ data: [{ user_id: 1, ... }, ...] }

// Format 3: In users
{ users: [{ user_id: 1, ... }, ...] }

// Format 4: With pagination
{
  data: [...],
  page: 1,
  limit: 10,
  total: 100
}

// Format 5: Success flag
{
  success: true,
  data: [...]
}
```

---

## Request/Response Examples

### Create User Request

```javascript
POST /admin/signup/user
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "email": "admin@example.com",
  "password": "securePassword123",
  "full_name": "Admin User",
  "phone": "+1234567890",
  "role": "admin"
}

// Response (200 OK):
{
  "user_id": 5,
  "email": "admin@example.com",
  "full_name": "Admin User",
  "phone": "+1234567890",
  "role": "admin",
  "created_at": "2026-01-23T10:30:00Z"
}
```

### Get Users Request

```javascript
GET /admin/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response (200 OK):
[
  {
    "user_id": 1,
    "email": "user1@example.com",
    "full_name": "User One",
    "phone": "1111111111",
    "role": "customer"
  },
  {
    "user_id": 2,
    "email": "user2@example.com",
    "full_name": "User Two",
    "phone": "2222222222",
    "role": "admin"
  }
]
```

### Update Role Request

```javascript
PUT /admin/user/1/role
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "role": "admin"
}

// Response (200 OK):
{
  "user_id": 1,
  "email": "user1@example.com",
  "role": "admin"
}
```

### Delete User Request

```javascript
DELETE /admin/user/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Quick Reference: Files to Update

If backend endpoints are different:

**1. Update `src/services/endpoints.js`:**

```javascript
export const adminAPI = {
  // Update these to match your backend
  createUser: (userData) => 
    apiClient.post('/YOUR/ENDPOINT/HERE', userData),
  
  getAllUsers: () => 
    apiClient.get('/YOUR/ENDPOINT/HERE'),
  
  // ... etc
};
```

**2. Update response parsing if needed:**

Edit ManageUsers.jsx's `fetchUsers()` function:

```javascript
const fetchUsers = async () => {
  const response = await adminAPI.getAllUsers();
  
  // Extract users based on your response format
  let users = response.data?.data || response.data || [];
  
  setUsers(users);
};
```

---

## Testing Checklist

Before deploying, verify:

- [ ] Backend running on correct port
- [ ] API URL correct in `.env.local`
- [ ] Can load users page without error
- [ ] Users list displays (if users exist)
- [ ] Can create new user
- [ ] New user appears in list
- [ ] Can update user role
- [ ] Role change persists on refresh
- [ ] Can delete user
- [ ] User removed from list
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] No console errors (F12)

---

## Support Resources

- **API Documentation:** `API_DOCUMENTATION.md`
- **Troubleshooting:** `ADMIN_TROUBLESHOOTING.md`
- **Quick Start:** `ADMIN_QUICK_START.md`
- **Service Code:** `src/services/endpoints.js`
- **Response Parser:** `src/services/responseParser.js`
- **Backend Tester:** `src/services/backendTester.js`

---

## Final Checklist

✅ **Backend Setup**
- Backend running on http://localhost:4000
- Admin endpoints exist (/admin/users, /admin/signup/user, etc.)
- Authentication working (tokens issued)

✅ **Frontend Setup**
- `.env.local` has `VITE_API_URL=http://localhost:4000`
- `src/services/endpoints.js` has correct paths
- Response parsing handles your format

✅ **Testing**
- Curl test passes: `curl http://localhost:4000/admin/users`
- Browser test passes: F12 console network request works
- UI test passes: Admin pages load and display data

**If all ✅, you're done! Admin is fully functional.**

---

**Version:** 1.0 | Last Updated: January 23, 2026
