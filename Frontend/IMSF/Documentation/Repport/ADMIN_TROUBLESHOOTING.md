# Admin Functionality Troubleshooting Guide

## Quick Fix Checklist

### 1. ✅ Backend Running?
```bash
# Check if backend is running on port 4000
curl http://localhost:4000/admin/users

# If error: "Connection refused"
# → Start your backend server first
```

### 2. ✅ Correct API URL?
**File:** `.env.local`
```
VITE_API_URL=http://localhost:4000
```
- ✅ Must match your backend URL
- ✅ No trailing slash
- ✅ Correct port number

### 3. ✅ Correct Endpoints?
Your backend must have these endpoints:

#### For User Management:
```
POST   /admin/signup/user      → Create new user
GET    /admin/users            → Get all users
PUT    /admin/user/:id/role    → Update user role
DELETE /admin/user/:id         → Delete user
```

#### For Packages:
```
GET    /packages               → Get all packages
POST   /packages               → Create package
```

#### For Destinations:
```
GET    /destinations           → Get all destinations
POST   /destinations           → Create destination
```

---

## Common Issues & Solutions

### Issue 1: "Cannot GET /admin/users" (404 Error)

**Problem:** Backend endpoint doesn't exist

**Solution:**
1. Check your backend routes
2. Verify endpoint paths match exactly
3. Update `src/services/endpoints.js` if needed

**Test:**
```bash
# From terminal, test the endpoint directly
curl http://localhost:4000/admin/users

# Should return user data, not 404 error
```

**If endpoint is different:**
```javascript
// In src/services/endpoints.js, change:
getAllUsers: () => 
  apiClient.get('/admin/users'),

// To your actual endpoint, e.g.:
getAllUsers: () => 
  apiClient.get('/api/users'),  // if your endpoint is /api/users
```

---

### Issue 2: Users List is Empty

**Problem:** Backend returns empty array or null

**Possible Causes:**
1. No users created yet
2. Backend query not working
3. Wrong response format

**Solution:**
1. First, create at least one user
2. Check database for existing users
3. Verify backend query is correct

**Test:**
```javascript
// Open browser console (F12 → Console)
// Run this to test:
import { adminAPI } from './services/endpoints';
const response = await adminAPI.getAllUsers();
console.log(response);
```

**Response should look like:**
```javascript
{
  status: 200,
  data: {
    data: [
      { user_id: 1, email: 'user@example.com', ... },
      { user_id: 2, email: 'user2@example.com', ... }
    ]
  }
}
```

---

### Issue 3: Cannot Create User

**Problem:** Getting error when creating user

**Common Errors:**

#### Error: "Invalid request body"
- Check all required fields filled
- Email format must be valid
- Password at least 6 characters

#### Error: "Email already exists"
- The email is already in database
- Use different email address

#### Error: "401 Unauthorized"
- Check admin token
- Admin must be logged in
- Token may be expired

**Solution:**
1. Check browser console for exact error
2. Verify all form fields are correct
3. Check backend validation rules

---

### Issue 4: Backend Response Format Wrong

**Problem:** Data isn't displayed even though request succeeds

**Common Response Formats:**

**Format 1: Direct array (SIMPLEST)**
```javascript
// Response:
[
  { user_id: 1, email: 'user@example.com' },
  { user_id: 2, email: 'user2@example.com' }
]

// Frontend expects:
response.data → array directly
```

**Format 2: Wrapped in data**
```javascript
// Response:
{
  data: [
    { user_id: 1, email: 'user@example.com' },
    { user_id: 2, email: 'user2@example.com' }
  ]
}

// Frontend expects:
response.data.data → array
```

**Format 3: Success flag**
```javascript
// Response:
{
  success: true,
  data: [
    { user_id: 1, email: 'user@example.com' },
    { user_id: 2, email: 'user2@example.com' }
  ]
}

// Frontend expects:
response.data.data → array
```

**Solution:** Check what format YOUR backend uses

1. Open browser Network tab (F12 → Network)
2. Go to Manage Users page
3. Look at the request to `/admin/users`
4. Click on it and check "Response" tab
5. See what format is returned
6. Update extraction logic if needed

---

## Debugging Tools

### Method 1: Browser Console Debug

```javascript
// Open browser console (F12 → Console)

// Import the API
import { adminAPI } from './src/services/endpoints';
import { extractArray } from './src/services/responseParser';

// Test getting users
const response = await adminAPI.getAllUsers();
console.log('Full response:', response);
console.log('Response data:', response.data);
console.log('Extracted users:', extractArray(response));
```

### Method 2: Network Tab Analysis

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for request to `/admin/users`
5. Click on it
6. Check tabs:
   - **Headers** → See request URL and headers
   - **Response** → See actual data returned
   - **Preview** → Pretty-printed response

### Method 3: Use Admin Diagnostics Page

**File:** `src/pages/admin/AdminDiagnostics.jsx`

```javascript
// Add route to AdminDashboard
import AdminDiagnostics from './AdminDiagnostics';

// In your router:
<Route path="/admin/diagnostics" element={<AdminDiagnostics />} />

// Visit: http://localhost:5173/admin/diagnostics
// Click "Run All Tests" to test all endpoints
```

---

## Endpoint Verification

### Check What Your Backend Actually Returns

**Using curl (from terminal):**
```bash
# Get all users
curl http://localhost:4000/admin/users

# Create user
curl -X POST http://localhost:4000/admin/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "1234567890",
    "role": "customer"
  }'

# Update user role
curl -X PUT http://localhost:4000/admin/user/1/role \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Using Postman:**
1. Download Postman
2. Create new request
3. Method: GET
4. URL: http://localhost:4000/admin/users
5. Send
6. Check response

---

## If Backend Endpoints Are Different

### Your backend uses different paths?

**Example:** If your backend uses `/api/admin/users` instead of `/admin/users`

**Solution: Update endpoints.js**

```javascript
// In src/services/endpoints.js

// Change:
getAllUsers: () => 
  apiClient.get('/admin/users'),

// To:
getAllUsers: () => 
  apiClient.get('/api/admin/users'),  // Your actual endpoint
```

**Or if backend structure is completely different:**

```javascript
// Example: Your backend uses /users/list instead of /admin/users

export const adminAPI = {
  // Map to your actual endpoints
  getAllUsers: () => 
    apiClient.get('/users/list'),  // Your endpoint
  
  createUser: (userData) => 
    apiClient.post('/users/register', userData),  // Your endpoint
  
  // ... etc
};
```

---

## Response Format Mismatch

### Your backend returns different format?

**In `src/pages/admin/ManageUsers.jsx`, the extraction already handles:**

```javascript
// Tries these formats in order:
1. response.data.data.data    // Triple nested
2. response.data.data         // Double nested
3. response.data              // Single nested
4. response.data.users        // Different key name
5. Direct array               // No wrapper
```

**If still not working:**

```javascript
// Debug in console:
const response = await adminAPI.getAllUsers();
console.log('Raw response:', response);
console.log('response.data:', response.data);

// Then add specific extraction for your format
// Example:
const users = response.data?.users || response.data?.data || response.data || [];
```

---

## Complete Testing Script

**Copy this to browser console and run:**

```javascript
// Step 1: Test connection
console.log('=== TESTING BACKEND CONNECTION ===');
try {
  const response = await fetch('http://localhost:4000/admin/users');
  console.log('✅ Backend is running (status: ' + response.status + ')');
} catch (e) {
  console.error('❌ Backend not responding:', e.message);
}

// Step 2: Test API endpoint
console.log('\n=== TESTING API ENDPOINT ===');
import { adminAPI } from './src/services/endpoints';
try {
  const response = await adminAPI.getAllUsers();
  console.log('✅ API endpoint works');
  console.log('Response:', response);
} catch (e) {
  console.error('❌ API endpoint failed:', e.message);
}

// Step 3: Test data extraction
console.log('\n=== TESTING DATA EXTRACTION ===');
import { extractArray } from './src/services/responseParser';
const users = extractArray(response);
console.log('✅ Users extracted:', users);
console.log('Number of users:', users.length);
```

---

## Common Backend Patterns

### Pattern 1: Express.js
```
POST   /admin/signup/user
GET    /admin/users
PUT    /admin/user/:id/role
DELETE /admin/user/:id
```

### Pattern 2: Nested Admin
```
POST   /admin/users/create
GET    /admin/users
PUT    /admin/users/:id/role
DELETE /admin/users/:id
```

### Pattern 3: Mixed (Most Common)
```
POST   /admin/signup/user     (Create)
GET    /users                 (Read - note: not /admin/users)
PUT    /admin/user/:id/role   (Update)
DELETE /admin/user/:id        (Delete)
```

**Identify which pattern your backend uses and update endpoints accordingly.**

---

## Quick Reference: Files to Check

1. **`.env.local`** → API URL configuration
2. **`src/services/endpoints.js`** → Endpoint definitions
3. **`src/pages/admin/ManageUsers.jsx`** → User management page
4. **`src/pages/admin/CreateUser.jsx`** → User creation form
5. **`src/services/responseParser.js`** → Response parsing utilities

---

## Still Stuck?

**Enable detailed logging:**

Add this to `src/services/api.js` at the top:

```javascript
// Enable logging
const DEBUG = true;

if (DEBUG) {
  apiClient.interceptors.request.use((config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  });

  apiClient.interceptors.response.use((response) => {
    console.log(`[API] ${response.status} ${response.config.url}`, response.data);
    return response;
  });
}
```

Then:
1. Open browser console (F12)
2. Refresh page
3. See all API calls logged
4. Check request/response details
5. Compare with your backend

---

## Support Information

When asking for help, provide:

1. **Error message from console**
   - Screenshot of F12 → Console error
   
2. **Network request details**
   - Screenshot of F12 → Network → Request details
   
3. **Backend response**
   - What does `/admin/users` actually return?
   - Use curl to test
   
4. **Backend endpoint list**
   - What endpoints does your backend have?
   - What request/response format?

---

## Last Resort: Reset Everything

If nothing works, try full reset:

```bash
# 1. Stop frontend dev server (Ctrl+C)
# 2. Delete node_modules
rm -r node_modules

# 3. Reinstall dependencies
npm install

# 4. Start fresh
npm run dev

# 5. Make sure backend is running
# Open new terminal: npm start (or your backend command)
```

---

**Version:** 1.0 (January 2026)
